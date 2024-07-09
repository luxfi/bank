import { User } from '@tools/models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { CreatePaymentsRequest } from './types/payments.request.type';
import { CreatePaymentsResponse } from './types/payments.response.type';

export abstract class CreatePaymentUseCase extends UseCaseHandler {
  gateway: string;
  abstract handle(
    payment: CreatePaymentsRequest,
    user: User,
  ): Promise<CreatePaymentsResponse>;
}
