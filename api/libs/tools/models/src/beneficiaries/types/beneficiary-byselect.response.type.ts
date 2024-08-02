export interface GetBeneficiariesSelectResponse {
  id: string;
  name: string;
}

export interface PaginationsSelectResponse {
  page: number;
  limit: number;
  totalEntries: number;
  totalPages: number;
}

export interface GetBeneficiariesSelectPaginatedResponse {
  beneficiaries: GetBeneficiariesSelectResponse[];
  pagination: PaginationsSelectResponse;
}
