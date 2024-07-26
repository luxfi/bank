import { EDirection } from '@cdaxfx/ports-currency-cloud';
import { ECurrencyCode } from '@cdaxfx/tools-misc';

export class PreviewConversionRequestDto {
    amount: number;
    sellCurrency: ECurrencyCode;
    buyCurrency: ECurrencyCode;
    date?: string;
    direction: EDirection;
}
