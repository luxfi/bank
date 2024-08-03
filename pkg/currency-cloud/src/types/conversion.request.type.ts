import { EDirection } from './direction.interface';
import { ECurrencyCode } from '@luxbank/misc';

export interface CreateConversionRequest {
  quoteId?: string;
  amount: number;
  sellCurrency: ECurrencyCode;
  buyCurrency: ECurrencyCode;
  date: string;
  direction: EDirection;
}
