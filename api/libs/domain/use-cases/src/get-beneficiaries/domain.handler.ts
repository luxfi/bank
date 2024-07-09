import { BeneficiariesRepository, User } from '@tools/models';
import { Request } from 'express';

import { Injectable } from '@nestjs/common';
import { GetBeneficiariesRequest } from './types/benefiary.request.type';
import { GetBeneficiariesPaginatedResponse } from './types/beneficiary.response.type';

@Injectable()
export class GetBeneficiariesDomainUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    private readonly beneficiariesRepository: BeneficiariesRepository,
  ) {}

  async handle(
    query: GetBeneficiariesRequest,
    user: User,
  ): Promise<GetBeneficiariesPaginatedResponse> {
    return this.beneficiariesRepository.findActiveByUserPaginated(query, user);
  }
}
