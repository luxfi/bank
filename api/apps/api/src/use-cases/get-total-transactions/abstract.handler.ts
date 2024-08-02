import { User } from '@cdaxfx/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';

export abstract class GetTotalTransactionsUseCase extends UseCaseHandler {
    abstract handle(user: User): Promise<number>;
}
