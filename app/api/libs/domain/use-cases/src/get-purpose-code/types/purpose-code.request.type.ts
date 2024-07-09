import { ECountryCode, ECurrencyCode } from '@tools/misc';

export interface PurposeCodeRequest {
  bankCountryCode: ECountryCode;
  currency: ECurrencyCode;
}
