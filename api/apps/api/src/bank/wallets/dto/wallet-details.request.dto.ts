import { ECurrencyCode } from '@tools/misc';

export class ViewDetailsRequestDto {
  currency?: ECurrencyCode;

  account?: string;

  paymentType?: string;

  page?: number;

  limit?: number;
}
