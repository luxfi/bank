import { AllRoles, ICurrentUser, UserRole } from '@/models/auth';

import { dataFetch } from './fetchers';
import { USERS } from './paths';

interface IResponse {
  statusCode: number;
  message?: string;
}

interface IUserResponse extends IResponse {
  data: {
    count: number;
    limit: number;
    page: number;
    users: ICurrentUser[];
  };
}

export async function getUsers(
  page = 1,
  limit = 20,
  role?: UserRole[]
): Promise<IUserResponse> {
  const roles = encodeURIComponent(role?.join(',') ?? AllRoles.join(','));
  const pageProp = encodeURIComponent(page);
  const limitProp = encodeURIComponent(limit);
  try {
    const response = await dataFetch({
      endpoint: USERS.GET_USERS(roles, pageProp, limitProp),
      method: 'GET',
    });

    const { statusCode, message, data } = response;

    if (data) {
      return {
        statusCode,
        data,
        message,
      };
    }
    throw new Error(message || 'Unable to get Users');
  } catch (err) {
    throw new Error('Unable to get Users');
  }
}

interface IArchivedUserResponse extends IResponse {
  data: ICurrentUser[];
}

export async function getArchivedUsers(): Promise<IArchivedUserResponse> {
  try {
    const response = await dataFetch({
      endpoint: USERS.GET_ARCHIVED_USERS,
      method: 'GET',
    });

    const { statusCode, data, message } = response;

    if (data) {
      return {
        statusCode,
        data: data.users,
        message,
      };
    }
    throw new Error(message ?? 'Unable to get Archived Users');
  } catch (error) {
    throw new Error('Unable to get Archived Users');
  }
}

export async function archivedUser(userId: string): Promise<IUserResponse> {
  try {
    const response = await dataFetch({
      endpoint: USERS.ARCHIVED(userId),
      method: 'DELETE',
    });

    const { statusCode, data, message } = response;

    if (data) {
      return {
        statusCode,
        data: data.users,
        message,
      };
    }
    throw new Error(message ?? 'Unable to get Archived Users');
  } catch (error) {
    throw new Error('Unable to get Archived Users');
  }
}

export async function restoreUser(uuid: string): Promise<IResponse> {
  try {
    const response = await dataFetch({
      endpoint: USERS.RESTORE_USER(uuid),
      method: 'POST',
    });

    const { statusCode, message } = response;

    if (statusCode === 200) {
      return {
        message,
        statusCode,
      };
    }

    throw new Error(message ?? 'Unable to Restore User');
  } catch (error) {
    throw new Error('Unable to Restore User');
  }
}
