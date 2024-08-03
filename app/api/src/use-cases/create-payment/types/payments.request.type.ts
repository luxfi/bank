import { ECurrencyCode } from '@luxbank/tools-misc';

export enum EPaymentType {
    PRIORITY = 'priority',
    REGULAR = 'regular'
}

export interface CreatePaymentsRequest {
    accountId: string;
    currency: ECurrencyCode;
    beneficiaryId: string;
    amount: number;
    date: string;
    reference: string;
    reason: string;
    type: EPaymentType;
    purposeCode?: string;
}
