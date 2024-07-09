import {
  EDateField,
  ETransactionStatus,
} from '@domain/use-cases/types/transaction.interface';
import { ECurrencyCode } from '@tools/misc';
import { TransactionStatus } from '@tools/models';

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
