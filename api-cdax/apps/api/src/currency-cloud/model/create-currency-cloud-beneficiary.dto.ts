import { BankAccountType } from './bank-account-type.enum';
import { IdentificationType } from './identification-type.enum';

export interface CreateCurrencyCloudBeneficiaryDto {
    name: string;
    bankAccountHolderName: string;
    bankCountry: string;
    currency: string;
    email?: string;
    beneficiaryAddress?: string;
    beneficiaryCountry?: string;
    accountNumber?: string;
    routingCodeType1?: string;
    routingCodeValue1?: string;
    routingCodeType2?: string;
    routingCodeValue2?: string;
    bicSwift?: string;
    iban?: string;
    defaultBeneficiary?: boolean;
    bankAddress?: string;
    bankName?: string;
    bankAccountType?: BankAccountType;
    beneficiaryEntityType?: string;
    beneficiaryCompanyName?: string;
    beneficiaryFirstName?: string;
    beneficiaryLastName?: string;
    beneficiaryCity?: string;
    beneficiaryPostcode?: string;
    beneficiaryStateOrProvince?: string;
    beneficiaryDateOfBirth?: string;
    beneficiaryIdentificationType?: IdentificationType;
    beneficiaryIdentificationValue?: string;
    paymentTypes?: string[];
    onBehalfOf?: string;
    beneficiaryExternalReference?: string;
}
