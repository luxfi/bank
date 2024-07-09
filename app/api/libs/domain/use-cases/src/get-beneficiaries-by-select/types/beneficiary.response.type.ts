import { ECountryCode, ECurrencyCode } from '@tools/misc';

export interface GetBeneficiariesSelectResponse {
  id: string;
  name: string; // firstname + lastname || company name
}

export interface PaginationsResponse {
  page: number;
  limit: number;
  totalEntries: number;
  totalPages: number;
}

export interface GetBeneficiariesSelectPaginatedResponse {
  beneficiaries: GetBeneficiariesSelectResponse[];
  pagination: PaginationsResponse;
}
