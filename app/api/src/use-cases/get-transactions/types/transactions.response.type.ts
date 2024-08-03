import { ETransactionApprovalStatus, ETransactionStatus, ETransactionType, TransactionCurrencyAmount } from '@luxbank/ports-ifx';

export interface PaginationsResponse {
    totalEntries: number;
    totalPages: number;
    page: number;
    limit: number;
}

export interface TransactionsResponse {
    id: string;
    status: ETransactionStatus;
    shortId: string;
    createdAt: string;
    updatedAt: string;
    settlementAt: string;
    completedAt: string;
    creatorName: string;
    beneficiaryName: string; // entityType === 'individual ? firstName + lastName : companyName
    clientName: string;
    transactionType: ETransactionType;
    in: TransactionCurrencyAmount;
    out: TransactionCurrencyAmount;
    approvalStatus?: ETransactionApprovalStatus;
    approvedBy?: string;
    approvalStatusChangedAt?: string;
    cdaxFee?: string;
    spread?: string;
}

export interface GetTransactionsResponse {
    data: TransactionsResponse[];
    pagination: PaginationsResponse;
}
