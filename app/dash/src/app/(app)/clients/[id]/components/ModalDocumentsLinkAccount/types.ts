import { DefaultOptionType } from 'antd/es/select';

export enum EGateway {
  CURRENCY_CLOUD = 'CURRENCY_CLOUD',
  IFX = 'IFX',
}

export const optionsPaymentGateway: Array<DefaultOptionType> = [
  { label: 'Currency Cloud', value: EGateway.CURRENCY_CLOUD },
  { label: 'IFX', value: EGateway.IFX },
];

export interface IFormCurrencyCloud {
  gateway: 'CURRENCY_CLOUD';
  contactId: string;
}

export interface IFormIFX {
  gateway: 'IFX';
  clientId: string;
  clientSecret: string;
  userName: string;
  password: string;
}

export type TForm = IFormCurrencyCloud | IFormIFX;

export const initCurrencyCloud: IFormCurrencyCloud = {
  gateway: 'CURRENCY_CLOUD',
  contactId: '',
};

export const initIFX: IFormIFX = {
  gateway: 'IFX',
  clientId: '',
  clientSecret: '',
  password: '',
  userName: '',
};
