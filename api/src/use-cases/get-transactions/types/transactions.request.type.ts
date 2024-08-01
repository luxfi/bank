import { EDateField } from '@cdaxfx/ports-ifx';
import { ECurrencyCode } from '@cdaxfx/tools-misc';

export class ListTransactionsRequest {
    status?: string;
    statusApproval?: string;
    dateField?: EDateField;
    startDate?: Date;
    endDate?: Date;
    beneficiary?: string;

    currency?: ECurrencyCode;
    minAmount?: string;
    maxAmount?: string;

    client?: string;
    type?: string;

    gateway?: string;

    reference?: string;
    account?: string;
    cdaxId?: string;

    page?: number;
    limit?: number;
    orderBy?: 'in' | 'out' | 'type' | 'status' | 'date' | 'creator' | 'id';
    order?: 'asc' | 'desc';
}
