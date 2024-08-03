import { ECountryCode, ECurrencyCode } from "@cdaxfx/tools-misc";

export interface GetBeneficiariesResponse {
    id: string;
    name: string;
    bankCountry: ECountryCode;
    currency: ECurrencyCode;
    status: string;
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