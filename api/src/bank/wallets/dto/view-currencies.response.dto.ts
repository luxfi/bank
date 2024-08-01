import { ECurrencyCode } from '@cdaxfx/tools-misc';

export class ViewCurrenciesResponseDto {
    currency: ECurrencyCode;
    name: string;
}

export class ViewCurrenciesPaginatedResponseDto {
    data: ViewCurrenciesResponseDto[];
}
