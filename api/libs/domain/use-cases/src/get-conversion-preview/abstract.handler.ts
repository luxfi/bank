import { User } from '@tools/models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { GetPreviewRequest } from './types/preview.request.type';
import { GetPreviewResponse } from './types/preview.response.type';

export abstract class GetPreviewUseCase extends UseCaseHandler {
  gateway: string;
  abstract handle(
    conversion: GetPreviewRequest,
    user: User,
  ): Promise<GetPreviewResponse>;
}
