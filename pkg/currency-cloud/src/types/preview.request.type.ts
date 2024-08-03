import { EDirection } from './direction.interface';
import { ECurrencyCode } from '@luxbank/misc';

export interface GetPreviewRequest {
  amount: number;
  sellCurrency: ECurrencyCode;
  buyCurrency: ECurrencyCode;
  date?: string;
  direction: EDirection;
}
