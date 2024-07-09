import { ECurrencyCode } from '@tools/misc';

export interface ViewBalancesResponse {
  currency: ECurrencyCode;
  name: string;
  amount: number;
}
