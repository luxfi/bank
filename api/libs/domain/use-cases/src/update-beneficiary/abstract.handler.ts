import { User } from '@tools/models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { UpdateBeneficiaryRequest } from './types/benefiary.request.type';
import { BeneficiaryResponse } from './types/beneficiary.response.type';

export abstract class UpdateBeneficiaryUseCase extends UseCaseHandler {
  abstract handle(
    id: string,
    params: UpdateBeneficiaryRequest,
    user: User,
  ): Promise<BeneficiaryResponse>;
}
