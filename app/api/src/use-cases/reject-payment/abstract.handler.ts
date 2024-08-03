import { User } from '@luxbank/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { RejectPaymentRequest } from './types/reject-payment.request.type';
import { RejectPaymentResponse } from './types/reject-payment.response.type';

export abstract class RejectPaymentUseCase extends UseCaseHandler {
    abstract handle(body: RejectPaymentRequest, user: User): Promise<RejectPaymentResponse>;
}
