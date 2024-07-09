import * as ApiHelpers from '../../utils/api-helpers';
import { User } from '../auth/AuthApi';
import { AdminRoles, UserOrAdminRoles } from "../auth/user-role.enum";
import { UserDto } from './model/userSchema';

export const getUsers = async (page = 1, limit = 20): Promise<{ users: any[], count: number }> => {
  const roles = UserOrAdminRoles;
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/users?roles=${encodeURIComponent(roles.join(','))}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
    { method: 'GET' }
  );

  if (res.ok) {
    const response = await res.json();
    return {
      users: response?.data?.users || [],
      count: response?.data?.count || 0,
    }
  }

  return { users: [], count: 0 };
}

export const getUser = async (uuid: string): Promise<User> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/users/${uuid}`,
    { method: 'GET' }
  );

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.user) {
      return response?.data?.user;
    }
  }

  throw new Error('User couldn\'t be fetched.');
}

export const archiveUser = async (uuid: string) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/users/${uuid}`,
    { method: 'DELETE' }
  );

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.user) {
      return response?.data?.user;
    }
  }

  throw new Error('Archiving the user failed.');
}

export const updateUser = async (uuid: string, data: UserDto) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/users/${uuid}`,
    { method: 'POST', body: JSON.stringify(data) }
  );

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.user) {
      return response?.data?.user;
    }
  }

  throw new Error('Updating the user failed.');
}
