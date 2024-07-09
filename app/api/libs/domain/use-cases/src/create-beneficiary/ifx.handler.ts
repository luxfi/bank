import { PaymentProviderIFX } from '@ports/ifx';
import { AccountType, BeneficiariesRepository, User } from '@tools/models';
import { EEntityType, IfxEntityType } from '../types/transaction.interface';
import { CreateBeneficiaryUseCase } from './abstract.handler';
import { CreateBeneficiaryRequest } from './types/benefiary.request.type';
import { BeneficiaryResponse } from './types/beneficiary.response.type';
import { Injectable, NotFoundException } from '@nestjs/common';
export class CreateBeneficiaryIFXUseCase extends CreateBeneficiaryUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    protected paymentProvider: PaymentProviderIFX,
    private beneficiariesRepository: BeneficiariesRepository,
  ) {
    super();
  }

  async handle(id: string): Promise<BeneficiaryResponse> {
    const beneficiary = await this.beneficiariesRepository.findOneById(id);

    if (!beneficiary) {
      throw new NotFoundException({
        messages: ['Beneficiary not found'],
      });
    }

    const response = await this.paymentProvider.createBeneficiary({
      firstNames: beneficiary.firstname,
      lastName: beneficiary.lastname,
      name: beneficiary.companyName,
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

    beneficiary.gatewayId = response.id;

    await this.beneficiariesRepository.persistAndFlush(beneficiary);

    return response;
  }
}
