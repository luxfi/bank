import { ECurrencyCode } from '@tools/misc';

export class ViewCurrenciesResponseDto {
  currency: ECurrencyCode;
  name: string;
}

export class ViewCurrenciesPaginatedResponseDto {
  data: ViewCurrenciesResponseDto[];
}
