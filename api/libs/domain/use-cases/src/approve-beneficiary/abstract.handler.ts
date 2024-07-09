import { User } from '@tools/models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { ApproveBeneficiaryRequest } from './types/benefiary.request.type';
import { ApproveBeneficiaryResponse } from './types/beneficiary.response.type';

export abstract class ApproveBeneficiaryUseCase extends UseCaseHandler {
  abstract handle(
    query: ApproveBeneficiaryRequest,
    user: User,
  ): Promise<ApproveBeneficiaryResponse>;
}
