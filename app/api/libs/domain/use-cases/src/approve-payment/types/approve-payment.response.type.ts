import { ECountryCode, ECurrencyCode } from '@tools/misc';

export interface ApprovePaymentResponse {
  id: string;
  name: string; // firstname + lastname || company name
  bankCountry: ECountryCode;
  currency: ECurrencyCode;
  status: string; // approved, pending
  currencyCloudId?: string;
  gatewayId?: string;
}
