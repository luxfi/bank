import { Injectable } from '@nestjs/common';
import { TransactionsRepository, User } from '@luxbank/tools-models';
import { GetBeneficiariesPaginatedResponse } from './types/beneficiary.response.type';

@Injectable()
export class GetCurrentBeneficiaryDomainUseCase {
    constructor(private readonly transactionsRepository: TransactionsRepository) { }

    async handle(user: User): Promise<GetBeneficiariesPaginatedResponse> {
        return this.transactionsRepository.findRecentBeneficiariesByUserId(
            user.getCurrentClient()?.uuid ?? ''
        );
    }
}
