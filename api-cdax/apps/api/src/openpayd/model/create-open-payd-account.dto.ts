import { AccountType } from '@cdaxfx/tools-models';
import { AccountStatus } from './account-status.enum';
import { IdentificationType } from './identification-type.enum';

export interface CreateOpenPaydAccountDto {
    accountName: string;
    legalEntityType: AccountType;
    street: string;
    city: string;
    country: string;
    postalCode?: string;
    brand?: string;
    yourReference?: string;
    status?: AccountStatus;
    stateOrProvince?: string;
    spreadTable?: string;
    apiTrading?: boolean;
    onlineTrading?: boolean;
    phoneTrading?: boolean;
    identificationType?: IdentificationType;
    identificationValue?: string;
    termsAndConditionsAccepted?: boolean;
}
