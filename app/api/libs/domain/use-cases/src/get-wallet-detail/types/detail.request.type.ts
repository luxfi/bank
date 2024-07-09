import { ECurrencyCode } from '@tools/misc';

export interface ViewDetailRequest {
  currency?: ECurrencyCode;
  account?: string;
  paymentType?: string;

  page?: number;
  limit?: number;
}
