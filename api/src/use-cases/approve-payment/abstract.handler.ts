import { User } from '@cdaxfx/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { ApprovePaymentRequest } from './types/approve-payment.request.type';
import { ApprovePaymentResponse } from './types/approve-payment.response.type';

export abstract class ApprovePaymentUseCase extends UseCaseHandler {
    abstract handle(body: ApprovePaymentRequest, user: User): Promise<ApprovePaymentResponse>;
}
