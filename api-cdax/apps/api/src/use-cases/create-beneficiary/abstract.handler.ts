import { UseCaseHandler } from '../types/use-case-handler.interface';
import { BeneficiaryResponse } from './types/beneficiary.response.type';

export abstract class CreateBeneficiaryUseCase extends UseCaseHandler {
    abstract handle(id: string): Promise<BeneficiaryResponse>;
}
