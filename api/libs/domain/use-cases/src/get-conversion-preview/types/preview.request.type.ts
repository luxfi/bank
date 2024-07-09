import { EDirection } from '@domain/use-cases/types/direction.interface';
import { ECurrencyCode } from '@tools/misc';

export interface GetPreviewRequest {
  amount: number;
  sellCurrency: ECurrencyCode;
  buyCurrency: ECurrencyCode;
  date?: string;
  direction: EDirection;
}
