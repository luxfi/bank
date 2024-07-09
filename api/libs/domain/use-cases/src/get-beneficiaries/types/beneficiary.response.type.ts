import { ECountryCode, ECurrencyCode } from '@tools/misc';

export interface GetBeneficiariesResponse {
  id: string;
  name: string; // firstname + lastname || company name
  bankCountry: ECountryCode;
  currency: ECurrencyCode;
  status: string; // approved, pending
  currencyCloudId: string;
  account?: string;
}

export interface PaginationsResponse {
  page: number;
  limit: number;
  totalEntries: number;
  totalPages: number;
}

export interface GetBeneficiariesPaginatedResponse {
  beneficiaries: GetBeneficiariesResponse[];
  pagination: PaginationsResponse;
}
