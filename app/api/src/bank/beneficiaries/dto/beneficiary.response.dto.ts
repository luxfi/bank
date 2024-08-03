import { ECountryCode, ECurrencyCode, SuccessResponseV2 } from '@luxbank/tools-misc';

export class BeneficiaryDetail {
    id: string;
    name: string; // firstname + lastname || company name
    firstName: string;
    lastName: string;
    entityType: string; // approved, pending
    address: string;
    city: string;
    state: string;
    country: string;
    currency: ECurrencyCode;
    bankCountry: string;
    bankName: string;
    bankCountryCode: string;
    sortCode: string;
    iban: string;
    bicSwift: string;
    accountNumber: string;
    bankAddress: string;
    currencyCloudId: string;
    postCode?: string;
    paymentType?: string; // paymentType: beneficiary.paymentType just currencycloud provider
    status: string; // approved, pending
}
export class GetBeneficiaryDetailResponse implements SuccessResponseV2<BeneficiaryDetail>
{
    data: BeneficiaryDetail;
}

export class GetBeneficiariesSelectResponse {
    id: string;
    name: string; // firstname + lastname || company name
}

export class GetBeneficiariesResponse {
    id: string;
    name: string; // firstname + lastname || company name
    bankCountry: string;
    currency: ECurrencyCode;
    status: string; // approved, pending
    currencyCloudId: string;
    account?: string;
}

export class PaginationsResponse {
    totalEntries?: number;
    totalPages?: number;
    page: number;
    limit: number;
}

export class ApproveAndDisapproveBeneficiaryResponseDto {
    data: BeneficiaryResponseDto;
}

export class BeneficiaryResponseDto {
    id: string;
    name: string;
    bankCountry: ECountryCode;
    currency: ECurrencyCode;
    status: string;
    gatewayId: string;
}

export class BeneficiaryUpdateResponse {
    data: {
        id: string;
    };
}

export class GetBeneficiariesSelectPaginatedResponse
    implements SuccessResponseV2<GetBeneficiariesSelectResponse[]>
{
    data: GetBeneficiariesSelectResponse[];
    pagination?: PaginationsResponse;
}

export class GetBeneficiariesPaginatedResponse
    implements SuccessResponseV2<GetBeneficiariesResponse[]>
{
    data: GetBeneficiariesResponse[];
    pagination?: PaginationsResponse;
}
