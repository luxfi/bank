import { EDateField, ETransactionStatus } from '@luxbank/ports-ifx';
import { ECurrencyCode } from '@luxbank/tools-misc';

export class ListTransactionRequest {
    status?: ETransactionStatus;
    dateField?: EDateField;
    startDate?: Date;
    endDate?: Date;

    currency?: ECurrencyCode;
    minAmount?: string;
    maxAmount?: string;

    reference?: string;
    account?: string;
}
