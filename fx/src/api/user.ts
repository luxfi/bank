import { ICurrentUser, IIndividualMetadataUser, UserRole } from '@/models/auth';
import { IBankMetadata } from '@/models/clients';

import { IFormValuesCreateUser } from '@/app/(app)/admin-users/model/types';
import { IResetPasswordData } from '@/app/(app)/profile/models/types';

import { dataFetch } from './fetchers';
import { USER } from './paths';

interface IResponse {
  data?: ICurrentUser;
  statusCode: number;
  message?: string;
}

interface IResponseUpdateUser extends IResponse {
  data?: ICurrentUser;
}

interface ICurrentUserDto {
  isCalledServer: boolean;
}

export async function getCurrentUser({
  isCalledServer,
}: ICurrentUserDto): Promise<IResponse> {
  const response = await dataFetch({
    endpoint: USER.CURRENT,
    method: 'GET',
    isCalledServer: isCalledServer,
  });

  return {
    statusCode: response.statusCode,
    data: response?.data?.user,
    message: response?.message,
  };
}

interface IResponseGetUser {
  data?: { user: ICurrentUser };
  statusCode: number;
}

export async function getUser(uuid: string): Promise<IResponseGetUser> {
  const response = await dataFetch({
    endpoint: USER.GET_USER(uuid),
    method: 'GET',
  });

  return {
    statusCode: response.statusCode,
    data: response?.data,
  };
}

export async function updateUserAdminUser(
  data: IFormValuesCreateUser
): Promise<{ statusCode: number }> {
  const response = await dataFetch({
    endpoint: USER.UPDATE_ADMIN_USER(data.uuid),
    method: 'POST',
    bodyParams: data,
  });

  return {
    statusCode: response.statusCode,
  };
}

interface IUpdateUserProps extends ICurrentUser {
  email: string;
}

export async function updateUser(
  data: IUpdateUserProps
): Promise<IResponseUpdateUser> {
  try {
    const response = await dataFetch({
      endpoint: USER.UPDATE_ADMIN_USER(data.uuid),
      method: 'POST',
      bodyParams: data,
    });

    const { statusCode, message } = response;

    if (statusCode === 200) {
      return {
        statusCode: statusCode,
      };
    }
    throw new Error(message?.[0] ?? 'error updating user');
  } catch (error: any) {
    throw new Error(error.message ?? 'error updating user');
  }
}

export async function archiveUser(
  uuid: string
): Promise<{ statusCode: number }> {
  const response = await dataFetch({
    endpoint: USER.ARCHIVE_USER(uuid),
    method: 'DELETE',
  });

  return {
    statusCode: response.statusCode,
  };
}

export async function createUser(
  user: IFormValuesCreateUser
): Promise<IResponse> {
  try {
    const response = await dataFetch({
      endpoint: USER.CREATE_USER,
      method: 'POST',
      bodyParams: user,
    });

    const { statusCode, message } = response;

    if (statusCode == 200) {
      if (response?.data?.user) {
        return response?.data?.user;
      }
    }

    throw new Error(message ?? 'error creating user');
  } catch (error) {
    throw new Error('error creating user');
  }
}

export async function resetPassword(
  data: IResetPasswordData
): Promise<boolean> {
  try {
    const response = await dataFetch({
      endpoint: USER.RESET_PASSWORD,
      method: 'POST',
      bodyParams: data,
    });

    const { statusCode, message } = response;

    if (statusCode === 200) {
      return true;
    }
    throw new Error(message?.[0] ?? 'error reset password');
  } catch (error: any) {
    throw new Error(error.message ?? 'error reset password');
  }
}

export async function updateUserMetadata(
  dto: IIndividualMetadataUser
): Promise<ICurrentUser | undefined> {
  try {
    const response = await dataFetch<{ user: ICurrentUser }>({
      endpoint: USER.METADATA,
      method: 'POST',
      bodyParams: dto,
    });

    const { statusCode, message, data } = response;

    if (statusCode === 200) {
      return data?.user;
    }
    throw new Error(message?.[0] ?? 'error reset password');
  } catch (error: any) {
    throw new Error(error.message ?? 'error reset password');
  }
}

export interface IUpdateCurrentUserV2Args {
  firstName: string;
  lastName: string;
  profileImage?: string;
  mobileNumber?: string;
  country?: string;
}

export interface IGetCurrentUserV2Response {
  statusCode: number;
  data: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    mobileNumber?: string;
    entityType: string;
    country: string;
  };
}

export async function getCurrentUserV2(params?: {
  cache: RequestCache;
}): Promise<IGetCurrentUserV2Response> {
  const response = await dataFetch({
    endpoint: USER.GET_CURRENT_USER_V2,
    method: 'GET',
    cache: params?.cache,
  });

  return {
    statusCode: response.statusCode,
    data: response?.data,
  };
}

export async function updateCurrentUserV2(
  dto: IUpdateCurrentUserV2Args
): Promise<IGetCurrentUserV2Response> {
  try {
    const response = await dataFetch({
      endpoint: USER.UPDATE_CURRENT_USER_V2,
      method: 'PATCH',
      bodyParams: dto,
    });

    const { statusCode, message, data } = response;

    if (statusCode === 200) {
      return data;
    }
    throw new Error(message?.[0] ?? 'error updating user');
  } catch (error: any) {
    throw new Error(error.message ?? 'error updating user');
  }
}

export async function updateUserBankMetadata(
  dto: IBankMetadata
): Promise<ICurrentUser | undefined> {
  try {
    const response = await dataFetch<{ user: ICurrentUser }>({
      endpoint: USER.METADATA,
      method: 'POST',
      bodyParams: {
        afterRegistration: true,
        bankMetadata: dto,
        partial: true,
      },
    });

    const { statusCode, message, data } = response;

    if (statusCode === 200) {
      return data?.user;
    }
    throw new Error(message?.[0] ?? 'error reset password');
  } catch (error: any) {
    throw new Error(error.message ?? 'error reset password');
  }
}
