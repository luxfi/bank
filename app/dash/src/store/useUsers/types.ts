import { ISortingPagination } from '@/components/Table';

import { IPaginationResponse } from '@/models/pagination';
import { IUser, IUserDetails } from '@/models/users';

import { IInviteSuperAdminPayload } from '@/app/(app)/admin-users/types';
import { IUserPayload } from '@/app/(app)/users/components/UserForm';
import { IUsersFilters } from '@/app/(app)/users/types';

import { IDefaultStates } from '../helpers/setStates';

export interface IUsersResponse {
  data: IUser[];
  pagination: IPaginationResponse;
}
export interface IUsersStates extends IDefaultStates<IUsersActions> {}

export interface IUsersActions {
  getUsers: (
    payload: IUsersFilters & ISortingPagination
  ) => Promise<IUsersResponse>;
  getUserById: (
    id: string,
    params?: { clientId: string }
  ) => Promise<IUserDetails>;

  getUserClientById(uuid: string): Promise<any>;

  archiveUser: (id: string) => Promise<void>;
  restoreUser: (id: string) => Promise<void>;

  inviteUser: (data: IUserPayload) => Promise<void>;

  addSuperAdmin: (data: IInviteSuperAdminPayload) => Promise<void>;

  updateUser: (data: IUserPayload) => Promise<void>;

  checkEmailExists: (
    email: string,
    params?: { clientId: string }
  ) => Promise<any>;
}

export const PATHS = {
  GET_USERS: '/api/v2.1/users',
  GET_USER_BY_ID: (id: string) => `/api/v2.1/users/${id}`,
  GET_USER_CLIENT_BY_ID: (uuid: string) => `/api/v1/admin/users/${uuid}`,
  ARCHIVE_USER: (id: string) => `/api/v1/admin/users/${id}`,
  UPDATE_USER: (id: string) => `/api/v2.1/users/${id}`,
  INVITE_USER: '/api/v1/invitations/user-role',
  INVITE_SUPER_ADMIN: '/api/v1/admin/users/super/new',
  CHECK_EMAIL_EXISTS: (email: string) => `/api/v1/admin/users/${email}/exists`,
  RESTORE_USER: (uuid: string) => `/api/v1/admin/clients/${uuid}/restore`,
};
