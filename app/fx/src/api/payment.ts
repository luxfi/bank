import { ICreatePaymentRequest } from '@/models/payment';

import { dataFetch } from './fetchers';
import { PAYMENT } from './paths';

interface IDeliveryDateDTO {
  bank_country: string;
  currency: string;
  payment_date: string;
  payment_type: string;
}

interface IResponse {
  message?: string;
  statusCode: number;
}

interface IGetDeliveryDateResponse extends IResponse {
  data: IDeliveryDateDTO;
}

export const getDeliveryDate = async (
  values: IDeliveryDateDTO
): Promise<IGetDeliveryDateResponse> => {
  try {
    const res = await dataFetch({
      endpoint: PAYMENT.DELIVERY_DATE,
      method: 'POST',
      bodyParams: values,
    });

    const { data, statusCode, message } = res;

    if (statusCode === 200) {
      return {
        data,
        statusCode,
        message,
      };
    }

    throw new Error(message ?? 'Validation failed.');
  } catch (error) {
    throw new Error('Validation failed.');
  }
};

interface ICreatePaymentResponse extends IResponse {
  data: {
    id: string;
  };
}

export const createPayment = async (
  values: ICreatePaymentRequest,
  isCalledServer?: boolean
): Promise<ICreatePaymentResponse> => {
  try {
    const res = await dataFetch({
      endpoint: PAYMENT.CREATE_PAYMENT,
      method: 'POST',
      bodyParams: values,
      isCalledServer: isCalledServer,
    });

    const { data, statusCode, message } = res;

    return {
      data: data,
      statusCode,
      message,
    };
  } catch (error) {
    throw new Error('create payment failed.');
  }
};

export const approveTransaction = async (id: string) => {
  try {
    const res = await dataFetch({
      endpoint: PAYMENT.APPROVE_PAYMENT(id),
      method: 'POST',
    });
    const { data, message } = res;

    if (message) {
      throw new Error(
        message ?? "Couldn't approve the transaction, please try again."
      );
    }
    return data;
  } catch (error) {
    throw new Error("Couldn't approve the transaction, please try again.");
  }
};

export const rejectTransaction = async (id: string, reason: string) => {
  try {
    const res = await dataFetch({
      endpoint: PAYMENT.REJECT_PAYMENT(id),
      method: 'POST',
      bodyParams: { description: reason },
    });

    const { data, message } = res;
    if (message) {
      throw new Error(
        message ?? "Couldn't reject the transaction, please try again."
      );
    }

    return data;
  } catch (error) {
    throw new Error("Couldn't reject the transaction, please try again.");
  }
};
