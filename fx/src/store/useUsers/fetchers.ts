import { IPaginationResponse } from '@/models/pagination';
import { IUser } from '@/models/users';

import { IInviteSuperAdminPayload } from '@/app/(app)/admin-users/types';
import { IUserPayload } from '@/app/(app)/users/components/UserForm';
import { IUsersFilters } from '@/app/(app)/users/types';

import { dataFetch } from '@/api/fetchers';

import { PATHS } from './types';

export async function getUsers(filters: IUsersFilters): Promise<{
  data: IUser[];
  pagination: IPaginationResponse;
}> {
  try {
    const res = await dataFetch({
      endpoint: PATHS.GET_USERS,
      method: 'GET',
      urlParams: filters as unknown as Record<string, string>,
    });

    if (![200, 201].includes(res.statusCode)) {
      throw new Error(res?.message);
    }

    return {
      data: res.data || [],
      pagination: res.pagination || ({} as IPaginationResponse),
    };
  } catch (err) {
    throw new Error('Unable to get Users');
  }
}

export async function getUserById(id: string, params?: { clientId: string }) {
  try {
    const res = await dataFetch({
      endpoint: PATHS.GET_USER_BY_ID(id),
      method: 'GET',
      urlParams: params,
    });

    if (![200, 201].includes(res.statusCode)) {
      throw new Error(res?.message);
    }

    return res;
  } catch (err) {
    throw new Error('Unable to get User');
  }
}

export async function getUserClientByIdAPI(uuid: string) {
  try {
    const res = await dataFetch({
      endpoint: PATHS.GET_USER_CLIENT_BY_ID(uuid),
      method: 'GET',
    });

    if ([200, 201].includes(res.statusCode)) {
      const { user } = res.data;

      return user;
    }

    throw new Error('Unable to get User');
  } catch (err) {
    throw new Error('Unable to get User');
  }
}

export async function archiveUser(id: string) {
  try {
    const res = await dataFetch({
      endpoint: PATHS.ARCHIVE_USER(id),
      method: 'DELETE',
    });

    if (res?.data?.statusCode) {
      throw new Error(res?.data?.message || 'Unable to reject this user');
    }
    return res.data;
  } catch (err) {
    throw new Error((err as any)?.message || 'Unable to reject this user');
  }
}

export async function restoreUser(id: string) {
  try {
    const res = await dataFetch({
      endpoint: PATHS.RESTORE_USER(id),
      method: 'POST',
    });

    if (![200, 201].includes(res.statusCode)) {
      throw new Error(res?.message);
    }
    return res;
  } catch (err) {
    throw new Error('Unable to restore this user');
  }
}

export async function checkEmail(email: string, params?: { clientId: string }) {
  try {
    const res = await dataFetch({
      endpoint: PATHS.CHECK_EMAIL_EXISTS(email),
      method: 'GET',
      urlParams: params,
    });

    if (![400, 404, 200].find((el) => el === res.statusCode)) {
      throw new Error('Unable to check Email');
    }

    return res;
  } catch (err) {
    throw new Error('Unable to check Email');
  }
}

export async function inviteUser(data: any) {
  try {
    const res = await dataFetch({
      endpoint: PATHS.INVITE_USER,
      method: 'POST',
      bodyParams: data,
    });

    if (![200, 201].includes(res.statusCode)) {
      throw new Error(res?.message);
    }

    return res;
  } catch (err) {
    throw new Error('Unable to invite User');
  }
}

export async function addSuperAdminUser(data: IInviteSuperAdminPayload) {
  try {
    const res = await dataFetch({
      endpoint: PATHS.INVITE_SUPER_ADMIN,
      method: 'POST',
      bodyParams: data,
    });

    if (![200, 201].includes(res.statusCode)) {
      throw new Error(res?.message);
    }
    return res;
  } catch (err) {
    throw new Error('Unable to invite Super Admin');
  }
}

export async function updateUser(data: IUserPayload) {
  const res = await dataFetch({
    endpoint: PATHS.UPDATE_USER(data.id),
    method: 'PATCH',
    bodyParams: data,
  });

  if (![200, 201].includes(res.statusCode)) {
    if (Array.isArray(res?.data?.messages)) {
      throw new Error(res?.data?.messages?.[0] ?? 'Unable to update user');
    }
    throw new Error('Unable to update user 2');
  }
  return res;
}
