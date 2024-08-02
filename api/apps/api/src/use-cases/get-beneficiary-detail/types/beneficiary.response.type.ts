import { ECurrencyCode } from '@cdaxfx/tools-misc';

export interface GetBeneficiaryDetailResponse {
    id: string;
    name: string; // firstname + lastname || company name
    firstName: string;
    lastName: string;
    entityType: string; // approved, pending
    address: string;
    city: string;
    state: string;
    country: string;
    currency: ECurrencyCode;
    bankCountry: string;
    bankName: string;
    bankCountryCode: string;
    sortCode: string;
    iban: string;
    bicSwift: string;
    accountNumber: string;
    bankAddress: string;
    currencyCloudId: string;
    postCode?: string;
    paymentType?: string;
    status: string;
    addressLine2?: string;
    companyName?: string;
}
