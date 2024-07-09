import { Injectable } from '@nestjs/common';
import { TransactionsRepository, User } from '@tools/models';
import { GetBeneficiariesPaginatedResponse } from './types/beneficiary.response.type';

@Injectable()
export class GetCurrentBeneficiaryDomainUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async handle(user: User): Promise<GetBeneficiariesPaginatedResponse> {
    return this.transactionsRepository.findRecentBeneficiariesByUserId(
      user.getCurrentClient()?.uuid ?? '',
    );
  }
}
