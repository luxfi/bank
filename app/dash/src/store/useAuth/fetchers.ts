import { ICurrentUser } from '@/models/auth';
import { IRequestError } from '@/models/request';

import { dataFetch } from '@/api/fetchers';

import {
  ICurrentClientInfo,
  IPayload2Fa,
  IPayloadImpersonate,
  ISignInPayload,
  IUserRiskRating,
  PATHS,
} from './types';

export async function checkAuthenticatedUser(): Promise<ICurrentUser> {
  const response = await dataFetch({
    endpoint: PATHS.CURRENT_USER,
    method: 'GET',
    isCalledServer: true,
  });

  return response?.data?.user;
}

export async function signIn(
  payload: ISignInPayload
): Promise<{ accessToken: string; user: ICurrentUser }> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.LOGIN,
      method: 'POST',
      bodyParams: {
        ...payload,
      },
    });

    const { credentials, user } = response.data;

    if (![200, 201].includes(response.statusCode)) {
      throw new Error(response?.message);
    }

    return {
      accessToken: credentials.accessToken,
      user: user,
    };
  } catch (error) {
    throw new Error(error as any);
  }
}

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const response = await dataFetch({
      endpoint: PATHS.FORGOT_PASSWORD,
      method: 'POST',
      bodyParams: {
        email: email,
      },
    });

    const { message } = response;

    if (message) {
      throw new Error(message);
    }
  } catch (err) {
    const error = err as unknown as IRequestError;
    throw new Error(error.message);
  }
};

export const check2faCode = async (
  payload: IPayload2Fa
): Promise<{ accessToken: string; user: ICurrentUser }> => {
  try {
    const response = await dataFetch({
      endpoint: PATHS.CHECK_2FA_CODE,
      method: 'POST',
      bodyParams: {
        ...payload,
      },
    });

    const { credentials, user, message } = response.data;

    if ([200, 201].includes(response.statusCode)) {
      return {
        accessToken: credentials.accessToken,
        user: user,
      };
    }
    throw new Error(message ?? 'Error checking 2FA code');
  } catch (err) {
    const error = err as unknown as IRequestError;
    throw new Error(error.message);
  }
};

export const send2faCode = async (provider: 'sms' | 'email'): Promise<void> => {
  try {
    const response = await dataFetch({
      endpoint: PATHS.SEND_2FA_CODE,
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

interface IChangeClient {
  credentials: {
    accessToken: string;
  };
  user: ICurrentUser;
}
export const changeClient = async (id: string): Promise<IChangeClient> => {
  try {
    const response = await dataFetch({
      endpoint: PATHS.CHANGE_CLIENT(id),
      method: 'GET',
    });

    if (response.statusCode !== 200) {
      throw new Error(response.message);
    }

    return response.data;
  } catch (err) {
    const error = err as unknown as IRequestError;
    throw new Error(error.message).message;
  }
};

export const getCurrentClientInfoAPI = async (): Promise<{
  user: IUserRiskRating;
  client: ICurrentClientInfo;
}> => {
  try {
    const response = await dataFetch({
      endpoint: PATHS.CURRENT_CLIENT_INFO,
      method: 'GET',
    });

    if (response.statusCode !== 200) {
      throw new Error(response.message);
    }

    return response.data;
  } catch (err) {
    const error = err as unknown as IRequestError;
    throw new Error(error.message).message;
  }
};

export const setImpersonateAPI = async (
  payload: IPayloadImpersonate
): Promise<{
  accessToken: string;
  superAdminToken: string;
  user: ICurrentUser;
}> => {
  try {
    const response = await dataFetch({
      endpoint: PATHS.IMPERSONATE,
      method: 'POST',
      bodyParams: {
        ...payload,
      },
    });

    if (!response.data) {
      throw new Error('Error on get user');
    }

    const { credentials, user, message } = response.data;

    if ([200, 201].includes(response.statusCode)) {
      return {
        accessToken: credentials.accessToken,
        superAdminToken: credentials.superAdminToken,
        user: user,
      };
    }

    throw new Error(message ?? '');
  } catch (err) {
    const error = err as unknown as IRequestError;
    throw new Error(error?.message ?? 'Error on set impersonate');
  }
};
