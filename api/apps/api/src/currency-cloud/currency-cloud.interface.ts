import { User } from '@tools/models';
import { CreateCurrencyCloudAccountDto } from './model/create-currency-cloud-account.dto';
import { CreateCurrencyCloudBeneficiaryDto } from './model/create-currency-cloud-beneficiary.dto';
import { CreateCurrencyCloudContactDto } from './model/create-currency-cloud-contact.dto';

export interface CurrencyCloudInterface {
  createAccount(
    account: CreateCurrencyCloudAccountDto,
    user: User,
  ): Promise<string>;
  createContact(
    contact: CreateCurrencyCloudContactDto,
    user: User,
  ): Promise<string>;

  validateBeneficiaryToCreate(
    beneficiary: CreateCurrencyCloudBeneficiaryDto,
    contactId: string,
    user: User,
  ): Promise<void>;

  createBeneficiary(
    beneficiary: CreateCurrencyCloudBeneficiaryDto,
    contactId: string,
    user: User,
  ): Promise<string[]>;

  deleteBeneficiary(id: string, contactId: string, user: User): Promise<void>;
}
