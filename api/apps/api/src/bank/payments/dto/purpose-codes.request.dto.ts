import { ECountryCode, ECurrencyCode } from '@tools/misc';

export class PurposeCodeRequestDto {
  bankCountryCode: ECountryCode;
  currency: ECurrencyCode;
}
