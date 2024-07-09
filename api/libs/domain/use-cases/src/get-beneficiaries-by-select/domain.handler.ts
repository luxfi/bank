import { BeneficiariesRepository, User } from '@tools/models';

import { Injectable } from '@nestjs/common';
import { GetBeneficiariesSelectRequest } from './types/benefiary.request.type';
import { GetBeneficiariesSelectPaginatedResponse } from './types/beneficiary.response.type';

@Injectable()
export class GetBeneficiariesSelectDomainUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    private readonly beneficiariesRepository: BeneficiariesRepository,
  ) {}

  async handle(
    query: GetBeneficiariesSelectRequest,
    user: User,
  ): Promise<GetBeneficiariesSelectPaginatedResponse> {
    return this.beneficiariesRepository.findActiveByUserPaginated(query, user);
  }
}
