import { User } from '@cdaxfx/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { ArchiveBeneficiaryResponse } from './types/beneficiary.response.type';

export abstract class ArchiveBeneficiaryUseCase extends UseCaseHandler {
    abstract handle(id: string, user: User): Promise<ArchiveBeneficiaryResponse>;
}
