import { ECountryCode, ECurrencyCode } from '@cdaxfx/tools-misc';

export class ApprovePaymentDataResponseDto {
    id: string;
    name: string; // firstname + lastname || company name
    bankCountry: ECountryCode;
    currency: ECurrencyCode;
    status: string; // approved, pending
    currencyCloudId?: string;
    gatewayId?: string;
}

export class ApprovePaymentResponseDto {
    data: ApprovePaymentDataResponseDto;
}
