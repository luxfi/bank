import { ECurrencyCode } from '@luxbank/misc';

export interface GetBeneficiariesResponse {
  id: string;
  name: string;
  bankCountry: string;
  currency: ECurrencyCode;
  status: string; 
  currencyCloudId: string;
}

export interface PaginationsResponse {
  page: number;
  limit: number;
}

export interface GetBeneficiariesPaginatedResponse {
  beneficiaries: GetBeneficiariesResponse[];
  pagination: PaginationsResponse;
}
