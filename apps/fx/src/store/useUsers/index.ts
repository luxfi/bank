import { IUserDetails } from '@/models/users';

import { IUsersFilters } from '@/app/(app)/users/types';
import { setErrorState, setLoadingState } from '@/store/helpers/setStates';
import { create } from 'zustand';

import { IInviteSuperAdminPayload } from './../../app/(app)/admin-users/types';
import * as api from './fetchers';
import { IUsersActions, IUsersResponse, IUsersStates } from './types';

type useUsersType = IUsersStates & IUsersActions;

export const useUsers = create<useUsersType>(() => ({
  errors: {} as IUsersStates['errors'],
  loading: {} as IUsersStates['loading'],

  async getUsers(payload: IUsersFilters) {
    setLoadingState(useUsers, 'getUsers', true);

    return await api
      .getUsers(payload)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        setErrorState(useUsers, 'getUsers', err);
        return {} as IUsersResponse;
      })
      .finally(() => {
        setLoadingState(useUsers, 'getUsers', false);
      });
  },

  async getUserClientById(uuid) {
    setLoadingState(useUsers, 'getUserClientById', true);

    return await api.getUserClientByIdAPI(uuid).finally(() => {
      setLoadingState(useUsers, 'getUserClientById', false);
    });
  },

  async getUserById(id: string, params?: { clientId: string }) {
    setLoadingState(useUsers, 'getUserById', true);

    return await api
      .getUserById(id, params)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        setErrorState(useUsers, 'getUserById', err);
        return {} as IUserDetails;
      })
      .finally(() => {
        setLoadingState(useUsers, 'getUserById', false);
      });
  },

  async checkEmailExists(email: string, params?: { clientId: string }) {
    setLoadingState(useUsers, 'checkEmailExists', true);
    return await api
      .checkEmail(email, params)
      .then((data) => data?.data)
      .catch((err) => {
        setErrorState(useUsers, 'checkEmailExists', err);
      })
      .finally(() => {
        setLoadingState(useUsers, 'checkEmailExists', false);
      });
  },

  async inviteUser(data: any) {
    setLoadingState(useUsers, 'inviteUser', true);

    await api
      .inviteUser(data)
      .catch((err) => {
        setErrorState(useUsers, 'inviteUser', err);
      })
      .finally(() => {
        setLoadingState(useUsers, 'inviteUser', false);
      });
  },

  async addSuperAdmin(data: IInviteSuperAdminPayload) {
    setLoadingState(useUsers, 'addSuperAdmin', true);

    await api
      .addSuperAdminUser(data)
      .catch((err) => {
        setErrorState(useUsers, 'addSuperAdmin', err);
      })
      .finally(() => {
        setLoadingState(useUsers, 'addSuperAdmin', false);
      });
  },

  async updateUser(data: any) {
    setLoadingState(useUsers, 'updateUser', true);

    await api.updateUser(data).finally(() => {
      setLoadingState(useUsers, 'updateUser', false);
    });
  },

  async archiveUser(id: string) {
    setLoadingState(useUsers, 'archiveUser', true);

    return await api
      .archiveUser(id)
      .catch((err) => {
        setErrorState(useUsers, 'archiveUser', err);
        throw err;
      })
      .finally(() => {
        setLoadingState(useUsers, 'archiveUser', false);
      });
  },

  async restoreUser(id: string) {
    setLoadingState(useUsers, 'restoreUser', true);
    await api
      .restoreUser(id)
      .catch((err) => {
        setErrorState(useUsers, 'restoreUser', err);
        throw err;
      })
      .finally(() => {
        setLoadingState(useUsers, 'restoreUser', false);
      });
  },
}));
