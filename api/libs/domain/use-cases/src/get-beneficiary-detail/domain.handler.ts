import { Injectable, NotFoundException } from '@nestjs/common';
import { ECurrencyCode } from '@tools/misc';
import { BeneficiariesRepository, User } from '@tools/models';
import { GetBeneficiaryDetailRequest } from './types/benefiary.request.type';
import { GetBeneficiaryDetailResponse } from './types/beneficiary.response.type';

@Injectable()
export class GetBeneficiaryDetailDomainUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    private readonly beneficiariesRepository: BeneficiariesRepository,
  ) {}

  async handle(
    param: GetBeneficiaryDetailRequest,
    user: User,
  ): Promise<GetBeneficiaryDetailResponse> {
    const beneficiary = await this.beneficiariesRepository.findOneByUserAndId(
      user,
      param.id,
    );

    if (!beneficiary) {
      throw new NotFoundException({
        messages: ['Beneficiary not found'],
      });
    }

    return {
      id: beneficiary.uuid,
      status: beneficiary.isApproved ? 'approved' : 'pending',
      paymentType: beneficiary.paymentType,
      name: beneficiary.getName(),
      companyName: beneficiary.companyName,
      firstName: beneficiary.firstname,
      lastName: beneficiary.lastname,
      entityType: beneficiary.entityType,
      address: beneficiary.address,
      city: beneficiary.city,
      state: beneficiary.state,
      country: beneficiary.country,
      currency: beneficiary.currency as ECurrencyCode,
      bankCountry: beneficiary.bankCountry,
      bankName: beneficiary.bankName,
      bankCountryCode: beneficiary.bankCountry,
      sortCode: beneficiary.sortCode,
      iban: beneficiary.IBAN,
      bicSwift: beneficiary.bicSwift,
      accountNumber: beneficiary.accountNumber,
      bankAddress: beneficiary.bankAddress,
      currencyCloudId: beneficiary.currencyCloudId ?? '',
      postCode: beneficiary.postcode,
      addressLine2: beneficiary.addressLine2,
    };
  }
}
