import { ContactStatus } from './contact-status.enum';

/** Based on: https://developer.currencycloud.com/docs/item/create-contact/ */
export interface CreateCurrencyCloudContactDto {
  accountId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;

  mobilePhoneNumber?: string;
  loginId?: string;
  status?: ContactStatus;
  local?: string;
  timezone?: string;
  dateOfBirth?: string;
}
