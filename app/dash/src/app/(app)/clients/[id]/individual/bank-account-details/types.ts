import { atLeastTwoFieldsValidation } from '@/utils/atLeastTwoFieldsYupValidator';

import * as Yup from 'yup';

export const validationForm = Yup.object({
  name: Yup.string().required(),
  branch: Yup.string().required(),
  account: Yup.string().required(),
  bankCountry: Yup.string().required(),
  accountCurrency: Yup.string().required(),
  iban: Yup.string()
    .min(15, 'IBAN needs to have 15 to 34 digits.')
    .max(34, 'IBAN needs to have 15 to 34 digits.')
    .matches(/^([A-Z0-9]\s*){15,34}$/, 'Please enter a valid IBAN.')
    .concat(atLeastTwoFieldsValidation(['bic', 'accountNumber', 'sortCode'])),

  bic: Yup.string()
    .min(8, 'BIC SWIFT needs to have 8 to 11 digits.')
    .max(11, 'BIC SWIFT needs to have 8 to 11 digits.')
    .matches(/^[0-9A-Z]{8}$|^[0-9A-Z]{11}$/, 'Please enter a valid BIC SWIFT.')
    .concat(atLeastTwoFieldsValidation(['iban', 'accountNumber', 'sortCode'])),

  accountNumber: Yup.string()
    .min(8, 'Account number needs to be 8 digits.')
    .max(8, 'Account number needs to be 8 digits.')
    .matches(/^[0-9]{8}$/, 'Please enter a valid account number.')
    .concat(atLeastTwoFieldsValidation(['iban', 'bic', 'sortCode'])),

  sortCode: Yup.string()
    .min(6, 'Sort code needs to be 6 digits.')
    .max(6, 'Sort code needs to be 6 digits.')
    .matches(/^[0-9]{6}$/, 'Please enter a valid sort code.')
    .concat(atLeastTwoFieldsValidation(['iban', 'bic', 'accountNumber'])),
});

export interface IBankAccount {
  name: string;
  branch: string;
  account: string;
  bankCountry: string;
  accountCurrency: string;
  sortCode: string;
  accountNumber: string;
  iban: string;
  bic: string;
}
