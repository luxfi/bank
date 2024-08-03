import { User } from '@cdaxfx/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { PurposeCodeRequest } from './types/purpose-code.request.type';
import { PurposeCodeResponse } from './types/purpose-code.response.type';

export abstract class GetPurposeCodesUseCase extends UseCaseHandler {
    abstract handle(query: PurposeCodeRequest, user: User): Promise<PurposeCodeResponse>;
}
