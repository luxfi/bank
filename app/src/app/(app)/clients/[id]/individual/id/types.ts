import { DefaultOptionType } from 'antd/es/select';

export interface IId {
  identificationType: string;
  identificationNumber: string;
}

export const optionIdentificationType: Array<DefaultOptionType> = [
  { label: 'Passport', value: 'passport' },
  { label: 'National ID', value: 'national_id' },
  { label: "Driver's License", value: 'drivers_license' },
];
