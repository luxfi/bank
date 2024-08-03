import { EDirection } from '@luxbank/ports-currency-cloud';
import { ECurrencyCode } from '@luxbank/tools-misc';

export class PreviewConversionResponseDto {
    rate: string;
    amount: string;
    sellCurrency: ECurrencyCode;
    buyCurrency: ECurrencyCode;
    direction: EDirection;
    expiresDate: string;
    first_conversion_cutoff_datetime?: string;
    first_conversion_date?: string;
    next_day_conversion_date?: string;
    default_conversion_date?: string;
    optimize_liquidity_conversion_date?: string;
    invalid_conversion_dates?: {
        [key: string]: string;
    };
}
