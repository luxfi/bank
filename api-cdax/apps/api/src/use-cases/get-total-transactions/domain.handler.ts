import { Injectable } from '@nestjs/common';
import { TransactionsRepository, User } from '@cdaxfx/tools-models';
import { GetTotalTransactionsUseCase } from './abstract.handler';

@Injectable()
export class GetTotalTransactionsDomainUseCase extends GetTotalTransactionsUseCase {
    constructor(private readonly transactionsRepository: TransactionsRepository) {
        super();
    }

    async handle(user: User): Promise<number> {
        const result = await this.transactionsRepository.count({
            account_id: user.getCurrentClient()?.account?.cloudCurrencyId,
            createdAt: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
        });

        if (!result)
            return 0;

        return result;
    }
}