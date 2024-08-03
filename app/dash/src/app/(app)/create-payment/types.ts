import { ICreatePaymentRequest } from '@/models/payment';

import { objectToQueryParams } from '@/utils/lib';

export const API_PATHS = {
  BENEFICIARY_DETAILS: (id: string) =>
    `/create-payment/api/beneficiary-details?id=${id}`,
  BENEFICIARY_LIST: (currencyCode: string) =>
    `/create-payment/api/beneficiaries?currencyCode=${currencyCode}`,
  CREATE_PAYMENT: (dto: ICreatePaymentRequest) =>
    `/create-payment/api/create-payment?${objectToQueryParams(dto)}`,
};
