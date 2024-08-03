import { ECountryCode, ECurrencyCode } from '@luxbank/tools-misc';

export interface ApproveBeneficiaryResponse {
    id: string;
    name: string;
    bankCountry: ECountryCode;
    currency: ECurrencyCode;
    status: string;
    gatewayId: string;
}
