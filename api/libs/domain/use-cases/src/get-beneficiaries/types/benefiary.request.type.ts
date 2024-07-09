import { ECountryCode, ECurrencyCode } from '@tools/misc';

export interface GetBeneficiariesRequest {
  name?: string;
  account?: string;
  currency?: ECurrencyCode;
  bankCountry?: ECountryCode;
  status?: string;
  order?: 'asc' | 'desc';
  orderBy?: 'name' | 'currency' | 'bankCountry' | 'status';
  page?: number;
  limit?: number;
  beneficiary?: string;
}
