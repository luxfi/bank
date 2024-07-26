class CurrenciesResponse {
    code: string;
    name: string;
}

export class ListCurrenciesResponseDto {
    data: CurrenciesResponse[];
}
