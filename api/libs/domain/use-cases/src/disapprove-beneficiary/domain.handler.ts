import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentProviderCurrencyCloud } from '@ports/currency-cloud';
import { MailerService } from '@ports/email';
import BeneficiaryEmail from '@ports/email/emails/beneficiary';
import { PaymentProviderIFX } from '@ports/ifx';
import { BeneficiariesRepository, Beneficiary, User } from '@tools/models';
import { DisapproveBeneficiaryRequest } from './types/benefiary.request.type';
import { DisapproveBeneficiaryResponse } from './types/beneficiary.response.type';

@Injectable()
export class DisapproveBeneficiaryDomainUseCase {
  constructor(
    private readonly beneficiariesRepository: BeneficiariesRepository,
    private readonly mailer: MailerService,
  ) {}

  async handle(
    query: DisapproveBeneficiaryRequest,
    user: User,
  ): Promise<DisapproveBeneficiaryResponse> {
    const beneficiary = await this.beneficiariesRepository.findOneByUserAndId(
      user,
      query.id,
    );

    if (!beneficiary) {
      throw new BadRequestException({
        messages: ['Beneficiary not found'],
      });
    }

    if (!beneficiary.gatewayId) {
      throw new BadRequestException({
        messages: ['Beneficiary not found on gateway.'],
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
      status: beneficiary.isApproved ? 'approved' : 'rejected',
      gatewayId: beneficiary.gatewayId ?? '',
    };
  }

  private async sendEmail(beneficiary: Beneficiary) {
    if (!!beneficiary.isApproved) {
      return;
    }
    return this.mailer.send(
      new BeneficiaryEmail(beneficiary.creator.username, {
        fullName: beneficiary.getName(),
        accountNumber: beneficiary.accountNumber,
        currency: beneficiary.currency,
        message: `The beneficiary has been disapproved because he/she does not meet the necessary requirements for CDAX Forex to process the payment. This could include having incorrect information, not having an active account, or not having the necessary documents required.`,
      }),
    );
  }

  private async createOnIFX(beneficiary: Beneficiary) {
    const gateway = PaymentProviderIFX.getInstance(beneficiary.creator);

    if (!!beneficiary.gatewayId) {
      await gateway.deleteBeneficiary(beneficiary.gatewayId);
    }

    beneficiary.gatewayId = '';
    beneficiary.isApproved = false;

    await this.beneficiariesRepository.persistAndFlush(beneficiary);
  }

  private async createOnCurrencyCloud(beneficiary: Beneficiary) {
    const gateway = PaymentProviderCurrencyCloud.getInstance();
    const cloudCurrencyId =
      beneficiary.account.gatewayId ?? beneficiary.account.cloudCurrencyId;

    if (!!cloudCurrencyId && !!beneficiary.gatewayId) {
      await gateway.deleteBeneficiary(
        beneficiary.gatewayId,
        cloudCurrencyId,
        beneficiary.creator,
      );
    }

    beneficiary.currencyCloudId = '';
    beneficiary.gatewayId = '';
    beneficiary.paymentType = '';
    beneficiary.isApproved = false;
  }
}
