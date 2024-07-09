import { User } from '@tools/models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { CreateConversionRequest } from './types/conversion.request.type';
import { CreateConversionResponse } from './types/conversion.response.type';

export abstract class CreateConversionUseCase extends UseCaseHandler {
  gateway: string;
  abstract handle(
    conversion: CreateConversionRequest,
    user: User,
  ): Promise<CreateConversionResponse>;
}
