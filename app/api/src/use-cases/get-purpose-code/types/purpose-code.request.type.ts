import { ECountryCode, ECurrencyCode } from '@luxbank/tools-misc';

export interface PurposeCodeRequest {
    bankCountryCode: ECountryCode;
    currency: ECurrencyCode;
}
