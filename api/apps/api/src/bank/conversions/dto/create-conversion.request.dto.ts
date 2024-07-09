import { EDirection } from '@domain/use-cases/types/direction.interface';
import { ECurrencyCode } from '@tools/misc';

export class CreateConversionRequestDto {
  amount: number;
  sellCurrency: ECurrencyCode;
  buyCurrency: ECurrencyCode;
  date: string;
  direction: EDirection;
}
