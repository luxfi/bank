import { ECurrencyCode, SuccessResponseV2 } from '@cdaxfx/tools-misc';

class PaginatedResponseDto<T> {
    data: T[];
    pagination: PaginationsResponseDto;
}

class PaginationsResponseDto {
    totalEntries?: number;
    totalPages?: number;
    page: number;
    limit: number;
}

export enum ETransactionStatus {
    COMPLETED = 'completed',
    PENDING = 'pending',
    FAILED = 'failed',
    REJECTED = 'rejected',
    EXPIRED = 'expired'
}

enum ETransactionApprovalStatus {
    IN_APPROVAL = 'in approval',
    APPROVED = 'approved',
    DENIED = 'denied',
    REJECTED = 'rejected'
}

enum ETransactionType {
    CONVERSION = 'conversion',
    PAYMENT = 'payment',
    INBOUND_FUNDS = 'inbound_funds'
}

class TransactionCurrencyAmount {
    currency: ECurrencyCode;
    amount: string;
}

export class TransactionsResponseDto {
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

export class ListTransactionsResponseDto
    implements SuccessResponseV2<TransactionsResponseDto[]>
{
    data: TransactionsResponseDto[];
    pagination?: PaginationsResponseDto;
}
