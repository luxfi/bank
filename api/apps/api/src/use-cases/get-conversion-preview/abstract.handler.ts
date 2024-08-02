import { User } from '@cdaxfx/tools-models';
import { GetPreviewRequest, GetPreviewResponse } from '@cdaxfx/ports-currency-cloud';
import { UseCaseHandler } from '../types/use-case-handler.interface';

export abstract class GetPreviewUseCase extends UseCaseHandler {
  gateway: string;
  abstract handle(conversion: GetPreviewRequest, user: User): Promise<GetPreviewResponse>;
}
