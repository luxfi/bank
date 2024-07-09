import {
  EDateField,
  ETransactionStatus,
} from '@domain/use-cases/types/transaction.interface';
import { ECurrencyCode } from '@tools/misc';

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
