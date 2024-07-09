import { ECountryCode, ECurrencyCode } from '@tools/misc';

export interface DisapproveBeneficiaryResponse {
  id: string;
  name: string; // firstname + lastname || company name
  bankCountry: ECountryCode;
  currency: ECurrencyCode;
  status: string; // approved, pending
  gatewayId: string;
}
