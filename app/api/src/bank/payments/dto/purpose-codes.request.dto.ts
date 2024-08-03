import { ECountryCode, ECurrencyCode } from '@luxbank/tools-misc';

export class PurposeCodeRequestDto {
    bankCountryCode: ECountryCode;
    currency: ECurrencyCode;
}
