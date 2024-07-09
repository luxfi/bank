import { EDirection } from '@domain/use-cases/types/direction.interface';
import { ECurrencyCode } from '@tools/misc';

export class PreviewConversionRequestDto {
  amount: number;
  sellCurrency: ECurrencyCode;
  buyCurrency: ECurrencyCode;

  /**
   * @description
   * Date of the conversion
   * @example 2021-01-01
   */
  date?: string;

  direction: EDirection;
}
