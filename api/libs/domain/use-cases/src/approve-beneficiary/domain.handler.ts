import {
  AccountType,
  BeneficiariesRepository,
  Beneficiary,
  User,
} from '@tools/models';
import { ApproveBeneficiaryRequest } from './types/benefiary.request.type';
import { ApproveBeneficiaryResponse } from './types/beneficiary.response.type';
import { SwiftCodeService } from 'apps/api/src/swift-code/swift-code.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isInUk, isSwift } from '@tools/misc';
import { PaymentProviderIFX } from '@ports/ifx';
import { PaymentProviderCurrencyCloud } from '@ports/currency-cloud';
import { IfxEntityType } from '../types/transaction.interface';
import { MailerService } from '@ports/email';
import BeneficiaryEmail from '@ports/email/emails/beneficiary';

export enum RoutingCodeType {
  SortCode = 'sort_code',
  ABA = 'aba',
  BsbCode = 'bsb_code',
  InstitutionNo = 'institution_no',
  BankCode = 'bank_code',
  BranchCode = 'branch_code',
  CLABE = 'clabe',
  CNAPS = 'cnaps',
  IFSC = 'ifsc',
}

export const getRoutingCodeByCountry = (country: string) => {
  switch (country) {
    case 'GB':
      return RoutingCodeType.SortCode;
    case 'US':
      return RoutingCodeType.ABA;
    case 'AU':
      return RoutingCodeType.BsbCode;
    case 'XX':
      return RoutingCodeType.BranchCode;
    case 'MX':
      return RoutingCodeType.CLABE;
    case 'CN':
      return RoutingCodeType.CNAPS;
    case 'IN':
      return RoutingCodeType.IFSC;
    default:
      break;
  }
  return null;
};

@Injectable()
export class ApproveBeneficiaryDomainUseCase {
  constructor(
    private readonly beneficiariesRepository: BeneficiariesRepository,
    private readonly swiftCodeService: SwiftCodeService,
    private readonly mailer: MailerService,
  ) {}

  async handle(
    query: ApproveBeneficiaryRequest,
    user: User,
  ): Promise<ApproveBeneficiaryResponse> {
    const beneficiary = await this.beneficiariesRepository.findOneByUserAndId(
      user,
      query.id,
    );

    if (!beneficiary) {
      throw new BadRequestException({
        messages: ['Beneficiary not found'],
      });
    }

    if (beneficiary.gatewayId) {
      throw new BadRequestException({
        messages: ['Beneficiary already approved'],
      });
    }

    if (!beneficiary.account?.gateway) {
      throw new BadRequestException({
        messages: ['Gateway not found'],
      });
    }

    const clientId = beneficiary.creator.clients
      .getItems()
      .find((c) => c.account?.uuid === beneficiary.account.uuid)?.uuid;

    if (clientId) {
      beneficiary.creator.setCurrentClient(clientId);
    }

    const gatewayMap = {
      ifx: () => this.createOnIFX(beneficiary),
      currencycloud: () => this.createOnCurrencyCloud(beneficiary),
    };

    await gatewayMap[beneficiary.account?.gateway]();

    await this.beneficiariesRepository.persistAndFlush(beneficiary);

    await this.sendEmail(beneficiary);

    return {
      id: beneficiary.uuid,
      name: beneficiary.getName(),
      bankCountry: beneficiary.bankCountry as any,
      currency: beneficiary.currency as any,
      status: beneficiary.isApproved ? 'approved' : 'pending',
      gatewayId: beneficiary.gatewayId ?? '',
    };
  }

  private async sendEmail(beneficiary: Beneficiary) {
    if (!beneficiary.isApproved) {
      return;
    }
    return this.mailer.send(
      new BeneficiaryEmail(beneficiary.creator.username, {
        fullName: beneficiary.getName(),
        accountNumber: beneficiary.accountNumber,
        currency: beneficiary.currency,
        message: `Congratulations to ${beneficiary.getName()} for being approved to receive payment through CDAX Forex!`,
      }),
    );
  }

  private async createOnIFX(beneficiary: Beneficiary) {
    const gateway = PaymentProviderIFX.getInstance(beneficiary.creator);

    const listBeneficiariesIfx = await gateway.listBeneficiaries({
      uniqueReference: beneficiary.uuid,
    });

    const [ifxBeneficiary] = listBeneficiariesIfx.data;

    const dataEntity =
      beneficiary.entityType === AccountType.Individual
        ? {
            firstNames: beneficiary.firstname,
            lastName: beneficiary.lastname,
          }
        : {
            name: beneficiary.companyName,
          };

    const response = ifxBeneficiary?.id
      ? await gateway.updateBeneficiary(ifxBeneficiary.id, {
          ...dataEntity,
          uniqueReference: beneficiary.uuid,
          address: {
            addressLine1: beneficiary.address,
            city: beneficiary.city,
            postcode: beneficiary.postcode,
            country: beneficiary.country,
          },
        })
      : await gateway.createBeneficiary({
          ...dataEntity,
          type:
            beneficiary.entityType === AccountType.Individual
              ? IfxEntityType.INDIVIDUAL
              : IfxEntityType.BUSINESS,
          uniqueReference: beneficiary.uuid,
          address: {
            addressLine1: beneficiary.address,
            city: beneficiary.city,
            postcode: beneficiary.postcode,
            country: beneficiary.country,
          },
        });

    if (!response?.id) {
      throw new BadRequestException({ messages: ['Beneficiary not approved'] });
    }

    await gateway.createAccountBeneficiary(response.id, {
      currency: beneficiary.currency,
      accountHolder: beneficiary.getName(),
      nickname: beneficiary.getName(),
      defaultReference: 'CDAX',
      ...((beneficiary.accountNumber && {
        accountNumber: beneficiary.accountNumber,
      }) ||
        null),
      ...((beneficiary.IBAN && { iban: beneficiary.IBAN }) || null),
      ...((beneficiary.bicSwift && { swiftBic: beneficiary.bicSwift }) || null),
      ...((beneficiary.sortCode && {
        sortCode: beneficiary.sortCode,
      }) ||
        null),
    });

    beneficiary.gatewayId = response.id;
    beneficiary.isApproved = true;

    await this.beneficiariesRepository.persistAndFlush(beneficiary);
  }

  private async createOnCurrencyCloud(beneficiary: Beneficiary) {
    const gateway = PaymentProviderCurrencyCloud.getInstance();
    const cloudCurrencyId = beneficiary.account.cloudCurrencyId;
    const currencyCloudData =
      this.createCurrencyCloudBeneficiaryDto(beneficiary);

    if (!cloudCurrencyId) {
      throw new BadRequestException({
        messages: ['Cloud currency not found'],
      });
    }

    const { errors: currencyCloudErrors } =
      await this.swiftCodeService.validateOnCurrencyCloud(
        currencyCloudData,
        cloudCurrencyId,
        beneficiary.creator,
      );

    if (currencyCloudErrors.length) {
      throw new BadRequestException({
        messages: currencyCloudErrors,
      });
    }

    const result = await gateway.createBeneficiary(
      currencyCloudData,
      beneficiary.creator,
    );

    if (!result) {
      throw new BadRequestException({
        messages: ['Error creating beneficiary'],
      });
    }

    beneficiary.currencyCloudId = result.id;
    beneficiary.gatewayId = result.id;
    beneficiary.paymentType = result?.payment_types?.join(',') ?? '';
    beneficiary.isApproved = true;
  }

  private createCurrencyCloudBeneficiaryDto(data: Beneficiary): any {
    const fullName = `${data.firstname} ${data.lastname}`;
    const result: any = {
      name: fullName,
      bankAccountHolderName: fullName,
      bankCountry: data.bankCountry,
      currency: data.currency,
      beneficiaryCity: data.city,
      beneficiaryCountry: data.country,
      beneficiaryEntityType: data.entityType,
    };
    if (data instanceof Beneficiary) {
      result.bankName = data.bankName;
      result.bankAddress = data.bankAddress;
    }
    if (data.entityType === AccountType.Individual) {
      result.name = fullName;
      result.beneficiaryFirstName = data.firstname;
      result.beneficiaryLastName = data.lastname;
      result.beneficiaryEntityType = 'individual';
      result.beneficiaryAddress = data.address.replace('\n', ', ');
    } else {
      result.name = data.companyName;
      result.bankAccountHolderName = data.companyName;
      result.beneficiaryCompanyName = data.companyName;
      result.beneficiaryEntityType = 'company';
      if (data.address) {
        result.beneficiaryAddress = data.address.replace('\n', ', ');
      }
    }
    result.beneficiaryStateOrProvince = data.state;
    result.beneficiaryPostcode = data.postcode;
    if (isInUk(data.bankCountry)) {
      if (data.accountNumber) {
        result.accountNumber = data.accountNumber;
      }

      if (data.sortCode) {
        result.routingCodeType1 = RoutingCodeType.SortCode;
        result.routingCodeValue1 = data.sortCode;
      }
      if ((!data.accountNumber || !data.sortCode) && data.IBAN) {
        result.routingCodeType1 = RoutingCodeType.SortCode;
        result.accountNumber = data.IBAN.substring(14, 22);
        result.routingCodeValue1 = data.IBAN.substring(8, 14);
      }
    } else if (data.accountNumber) {
      const routingCode = getRoutingCodeByCountry(data.bankCountry);
      result.accountNumber = data.accountNumber;
      if (routingCode && data.sortCode) {
        result.routingCodeType1 = routingCode;
        result.routingCodeValue1 = data.sortCode;
      }
    }
    if (data.IBAN) {
      result.iban = data.IBAN;
      if (data.bicSwift) {
        result.bicSwift = data.bicSwift;
      }
    } else if (isSwift(data.bankCountry)) {
      result.bicSwift = data.bicSwift;
    }
    return result;
  }
}
