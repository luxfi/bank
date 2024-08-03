import { User } from '@luxbank/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { CreateConversionRequest, CreateConversionResponse } from '@luxbank/ports-currency-cloud';

export abstract class CreateConversionUseCase extends UseCaseHandler {
    gateway: string;
    abstract handle(conversion: CreateConversionRequest, user: User): Promise<CreateConversionResponse>;
}
