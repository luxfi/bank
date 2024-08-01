import { EDateField, ETransactionStatus } from '@cdaxfx/ports-ifx';
import { ECurrencyCode } from '@cdaxfx/tools-misc';

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
