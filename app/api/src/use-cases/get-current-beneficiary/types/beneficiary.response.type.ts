import { ECurrencyCode } from '@luxbank/tools-misc';

export interface GetBeneficiariesResponse {
    id: string;
    name: string; // firstname + lastname || company name
    bankCountry: string;
    currency: ECurrencyCode;
    status: string; // approved, pending
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
