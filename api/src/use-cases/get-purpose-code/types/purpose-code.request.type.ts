import { ECountryCode, ECurrencyCode } from '@cdaxfx/tools-misc';

export interface PurposeCodeRequest {
    bankCountryCode: ECountryCode;
    currency: ECurrencyCode;
}
