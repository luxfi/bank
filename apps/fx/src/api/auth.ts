/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICurrentUser, IResponseAuth } from '@/models/auth';
import { IRequestError } from '@/models/request';

import Cookies from 'js-cookie';

import { dataFetch } from './fetchers';
import { AUTH } from './paths';

interface ISignInDTO {
  username: string;
  password: string;
  r: string;
}

interface IForgotPasswordDTO {
  email: string;
}

export async function signIn(data: ISignInDTO): Promise<ICurrentUser> {
  try {
    const response = await dataFetch<IResponseAuth>({
      endpoint: AUTH.LOGIN,
      method: 'POST',
      bodyParams: {
        ...data,
      },
    });

    if (response.statusCode === 200 && response?.data) {
      const { credentials, user } = response.data;

      Cookies.set(
        process.env.NEXT_PUBLIC_JWT_COOKIE ?? '',
        credentials.accessToken
      );

      return user;
    }

    throw new Error(response?.message ?? '');
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

export const forgotPassword = async (
  data: IForgotPasswordDTO
): Promise<boolean> => {
  try {
    const response = await dataFetch({
      endpoint: AUTH.FORGOT_PASSWORD,
      method: 'POST',
      bodyParams: {
        ...data,
      },
    });

    const { statusCode, message } = response;

    if (statusCode === 200) {
      return true;
    }

    if (message) {
      throw new Error(message);
    }

    throw new Error('Sorry. Something went wrong.');
  } catch (err) {
    const error = err as unknown as IRequestError;
    throw new Error(error.message);
  }
};

export const check2faCode = async (
  code: string,
  provider: 'sms' | 'email'
): Promise<ICurrentUser> => {
  try {
    const response = await dataFetch({
      endpoint: AUTH.CHECK_2FA_CODE,
      method: 'POST',
      bodyParams: {
        code: code,
        provider: provider,
      },
    });

    if (response.statusCode === 200 && response?.data) {
      const { credentials, user } = response.data;

      Cookies.set(
        process.env.NEXT_PUBLIC_JWT_COOKIE ?? '',
        credentials.accessToken
      );

      return user;
    }
    const { message } = response;

    throw new Error(message);
  } catch (err) {
    const error = err as unknown as IRequestError;
    throw new Error(error.message).message;
  }
};

export const send2faCode = async (provider: 'sms' | 'email'): Promise<any> => {
  try {
    const response = await dataFetch({
      endpoint: AUTH.SEND_2FA_CODE,
      method: 'POST',
      bodyParams: {
        provider,
      },
    });

    const { statusCode, message, data } = response;

    if (statusCode === 200) {
      return data;
    }

    if (message) {
      throw new Error(message);
    }

    throw new Error('Sorry. Something went wrong.');
  } catch (err) {
    const error = err as unknown as IRequestError;
    throw new Error(error.message).message;
  }
};
