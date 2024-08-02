import { ECountryCode, ECurrencyCode } from '@cdaxfx/tools-misc';

export interface ApproveBeneficiaryResponse {
    id: string;
    name: string;
    bankCountry: ECountryCode;
    currency: ECurrencyCode;
    status: string;
    gatewayId: string;
}
