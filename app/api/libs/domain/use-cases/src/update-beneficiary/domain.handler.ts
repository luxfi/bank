import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AccountType,
  BeneficiariesRepository,
  Beneficiary,
  User,
  UserRole,
} from '@tools/models';
import { SwiftCodeService } from 'apps/api/src/swift-code/swift-code.service';
import {
  EDefaultRoutingCodesNames,
  EEntityType,
  IfxEntityType,
  ReversedERoutingCodesNames,
  RoutingCodes,
} from '../types/transaction.interface';
import { UpdateBeneficiaryRequest } from './types/benefiary.request.type';
import { BeneficiaryResponse } from './types/beneficiary.response.type';
import { isInUk, isSwift } from '@tools/misc';

import { PaymentProviderIFX } from '@ports/ifx';
import { PaymentProviderCurrencyCloud } from '@ports/currency-cloud';

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
export class UpdateBeneficiaryDomainUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    private readonly beneficiariesRepository: BeneficiariesRepository,
    private readonly swiftCodeService: SwiftCodeService,
  ) {}

  async handle(
    id: string,
    params: UpdateBeneficiaryRequest,
    user: User,
  ): Promise<BeneficiaryResponse> {
    const beneficiary = await this.beneficiariesRepository.findOneByUserAndId(
      user,
      id,
    );

    if (!beneficiary) {
      throw new BadRequestException({
        messages: ['Beneficiary not found'],
      });
    }

    if (user.role !== UserRole.SuperAdmin && !beneficiary.isApproved) {
      throw new BadRequestException({
        messages: ['Beneficiary is not approved.'],
      });
    }

    const isDelete = this.isDelete(beneficiary, params);
    const beneficaryToSave = this.update(beneficiary, params, user);

    const clientId = beneficiary.creator.clients
      .getItems()
      .find((c) => c.account?.uuid === beneficiary.account.uuid)?.uuid;

    if (clientId) {
      beneficiary.creator.setCurrentClient(clientId);
    }

    const updateGatewayMap = {
      ifx: () => this.updateOnIFX(beneficiary),
      currencycloud: () => this.updateOnCurrencyCloud(user, beneficiary),
    };

    const deleteGatewayMap = {
      ifx: () => this.deleteOnIFX(beneficiary),
      currencycloud: () => this.deleteOnCurrencyCloud(user, beneficiary),
    };

    if (!beneficiary.account?.gateway) {
      throw new BadRequestException({
        messages: ['Gateway not found.'],
      });
    }

    beneficiary.creator.setCurrentClient(beneficiary.client_uuid);

    if (beneficiary.isApproved) {
      if (isDelete && user.role !== UserRole.SuperAdmin) {
        await deleteGatewayMap[beneficiary.account?.gateway]();
        beneficiary.isApproved = false;
        beneficiary.gatewayId = '';
      } else {
        await updateGatewayMap[beneficiary.account?.gateway]();
      }
    }

    await this.beneficiariesRepository.persistAndFlush(beneficaryToSave);

    return { id: beneficaryToSave.uuid };
  }

  private async updateOnCurrencyCloud(creator: User, beneficiary: Beneficiary) {
    const gateway = PaymentProviderCurrencyCloud.getInstance();
    const cloudCurrencyId = beneficiary.account.gatewayId;
    const currencyCloudData =
      this.createCurrencyCloudBeneficiaryDto(beneficiary);

    if (!cloudCurrencyId) {
      beneficiary.isApproved = false;
    }

    const { errors: currencyCloudErrors } =
      await this.swiftCodeService.validateOnCurrencyCloud(
        currencyCloudData,
        cloudCurrencyId!,
        creator,
      );

    if (currencyCloudErrors.length) {
      throw new BadRequestException({ messages: currencyCloudErrors });
    }

    if (!beneficiary.gatewayId) {
      throw new BadRequestException({
        messages: ['Gateway not found.'],
      });
    }

    const result = await gateway.updateBeneficiary(
      beneficiary.gatewayId,
      currencyCloudData,
      cloudCurrencyId!,
      creator,
    );

    if (!result) {
      throw new BadRequestException({
        messages: ['Failed to update beneficiary on currency cloud.'],
      });
    }
    return { id: result };
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
  private isDelete(
    originalBeneficiary: Beneficiary,
    dto: UpdateBeneficiaryRequest,
  ): boolean {
    const codes = !!dto.routingCodes?.length && this.getCodes(dto.routingCodes);

    return (
      (codes.IBAN && originalBeneficiary.IBAN !== codes.IBAN) ||
      (codes.BIC_SWIFT && originalBeneficiary.bicSwift !== codes.BIC_SWIFT) ||
      (codes.SORT_CODE && originalBeneficiary.sortCode !== codes.SORT_CODE) ||
      (codes.ACCOUNT_NUMBER &&
        originalBeneficiary.accountNumber !== codes.ACCOUNT_NUMBER) ||
      (dto.bankCountry &&
        originalBeneficiary.bankCountry !== dto.bankCountry) ||
      (dto.currency && originalBeneficiary.currency !== dto.currency)
    );
  }

  private async saveBankDetails(beneficiary: Beneficiary, user: User) {
    const bankDetails = await this.swiftCodeService.getBankDetails(
      beneficiary,
      user,
    );
    beneficiary.bankName = bankDetails?.bankName ?? beneficiary.bankName;
    beneficiary.branchName = bankDetails?.branchName ?? beneficiary.branchName;
    beneficiary.bankAddress =
      bankDetails?.bankAddress ?? beneficiary.bankAddress;
  }

  private getCodes(routingCodes: RoutingCodes[]): any {
    return {
      ...routingCodes.reduce((acc, code, index) => {
        return {
          ...acc,
          [ReversedERoutingCodesNames[code.name as any]]: code.value,
        };
      }, {}),
    };
  }

  update(
    beneficiary: Beneficiary,
    dto: UpdateBeneficiaryRequest,
    user: User,
  ): Beneficiary {
    beneficiary.entityType =
      (dto.entityType as any) ?? (beneficiary.entityType as any);
    beneficiary.currency = dto.currency ?? beneficiary.currency;
    beneficiary.address = dto.address ?? beneficiary.address;
    beneficiary.addressLine2 = dto.addressLine2 ?? beneficiary.addressLine2;
    beneficiary.city = dto.city ?? beneficiary.city;
    beneficiary.state = dto.state ?? beneficiary.state;
    beneficiary.postcode = dto.postCode ?? beneficiary.postcode;
    beneficiary.country = dto.country ?? beneficiary.country;
    beneficiary.bankCountry = dto.bankCountry ?? beneficiary.bankCountry;

    if (dto.entityType === EEntityType.INDIVIDUAL) {
      beneficiary.firstname = dto.firstName ?? beneficiary.firstname;
      beneficiary.lastname = dto.lastName ?? beneficiary.lastname;
    }

    if (dto.entityType === EEntityType.BUSINESS) {
      beneficiary.companyName = dto.companyName ?? beneficiary.companyName;
    }

    const codes = !!dto.routingCodes?.length && this.getCodes(dto.routingCodes);

    if (
      codes.ACCOUNT_NUMBER &&
      beneficiary.accountNumber !== codes.ACCOUNT_NUMBER
    ) {
      beneficiary.accountNumber = String(codes.ACCOUNT_NUMBER);
    }

    if (codes.SORT_CODE && beneficiary.sortCode !== codes.SORT_CODE) {
      beneficiary.sortCode = String(codes.SORT_CODE);
    }

    if (
      codes.IBAN &&
      !isSwift(codes.bankCountry) &&
      codes.IBAN !== beneficiary.IBAN
    ) {
      beneficiary.IBAN = codes.IBAN ?? '';
    }

    if (codes.BIC_SWIFT && beneficiary.bicSwift !== codes.BIC_SWIFT) {
      beneficiary.bicSwift = codes.BIC_SWIFT ?? '';
    }

    this.saveBankDetails(beneficiary, user);

    return beneficiary;
  }

  private async updateOnIFX(beneficiary: Beneficiary) {
    const gateway = PaymentProviderIFX.getInstance(beneficiary.creator);
    await gateway.updateBeneficiary(beneficiary.gatewayId!, {
      firstNames: beneficiary.firstname,
      lastName: beneficiary.lastname,
      name: beneficiary.companyName,
      uniqueReference: beneficiary.uuid,
      address: {
        addressLine1: beneficiary.address,
        city: beneficiary.city,
        postcode: beneficiary.postcode,
        country: beneficiary.country,
      },
    });

    await this.beneficiariesRepository.persistAndFlush(beneficiary);
  }

  private async deleteOnCurrencyCloud(creator: User, beneficiary: Beneficiary) {
    const gateway = PaymentProviderCurrencyCloud.getInstance();
    const cloudCurrencyId = beneficiary.account.gatewayId;

    await gateway.deleteBeneficiary(
      beneficiary.gatewayId!,
      cloudCurrencyId!,
      creator,
    );
  }

  private async deleteOnIFX(beneficiary: Beneficiary) {
    const gateway = PaymentProviderIFX.getInstance(beneficiary.creator);

    await gateway.deleteBeneficiary(beneficiary.gatewayId!);
  }
}
