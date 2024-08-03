import { User } from '@luxbank/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { DisapproveBeneficiaryRequest } from './types/beneficiary.request.type';
import { DisapproveBeneficiaryResponse } from './types/beneficiary.response.type';

export abstract class DisapproveBeneficiaryUseCase extends UseCaseHandler {
    abstract handle(query: DisapproveBeneficiaryRequest, user: User): Promise<DisapproveBeneficiaryResponse>;
}
