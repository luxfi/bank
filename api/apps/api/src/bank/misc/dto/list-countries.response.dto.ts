class CountriesResponse {
  code: string;
  name: string;
}

export class ListCountriesResponseDto {
  data: CountriesResponse[];
}
