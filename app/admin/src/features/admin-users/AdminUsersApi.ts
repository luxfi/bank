import { date } from 'yup';
import * as ApiHelpers from '../../utils/api-helpers';
import { User } from '../auth/AuthApi';
import { AdminRoles, UserRole, UserRoles } from "../auth/user-role.enum";
import { AdminUserDto } from './model/adminUserSchema';

export const getAdminUsers = async (page = 1, limit = 20): Promise<{ users: any[], count: number }> => {
  const roles = AdminRoles;
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

export const getUsers = async (page = 1, limit = 20): Promise<{ users: any[], count: number }> => {
  const roles = UserRoles;
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

export const getAdminUser = async (uuid: string): Promise<User> => {
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

export const createUser = async (data: AdminUserDto) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/users`,
    { method: 'POST', body: JSON.stringify(data) }
  );

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.user) {
      return response?.data?.user;
    }
  }

  throw new Error('Creating the user failed, please make sure all the fields are valid and the email is not in use.');
};

export const updateUser = async (uuid: string, data: AdminUserDto) => {
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