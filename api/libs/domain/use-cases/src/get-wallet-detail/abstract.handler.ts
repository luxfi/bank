import { User } from '@tools/models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { ViewPaginatedDetailResponse } from './types/detail.response.type';
import { ViewDetailRequest } from './types/detail.request.type';

export abstract class GetWalletDetailUseCase extends UseCaseHandler {
  abstract handle(
    query: ViewDetailRequest,
    user: User,
  ): Promise<ViewPaginatedDetailResponse>;
}
