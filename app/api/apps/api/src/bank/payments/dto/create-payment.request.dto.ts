import { EPaymentType } from '../../transactions/dto/transaction-detail.response.dto';
import { ECurrencyCode } from '@tools/misc';

export class CreatePaymentRequestDto {
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
