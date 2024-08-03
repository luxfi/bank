import { StoreApi, UseBoundStore, create } from 'zustand';

import { setErrorState, setLoadingState } from '../helpers/setStates';
import {
  getSuperAdminDashboardInfoAPI,
  getUserDashboardInfoAPI,
} from './fetchers';
import {
  IDashboardActions,
  IDashboardStates,
  ISuperAdminDashboardInfoReponse,
  IUserDashboardInfo,
} from './types';

type TUseDashboard = IDashboardStates & IDashboardActions;

export const useDashboard: UseBoundStore<StoreApi<TUseDashboard>> =
  create<TUseDashboard>(() => ({
    errors: {} as TUseDashboard['errors'],
    loading: {} as TUseDashboard['loading'],

    async getSuperAdminDashboardInfo() {
      setLoadingState(useDashboard, 'getSuperAdminDashboardInfo', true);

      return await getSuperAdminDashboardInfoAPI()
        .catch((err) => {
          setErrorState(useDashboard, 'getSuperAdminDashboardInfo', err);
          return {} as ISuperAdminDashboardInfoReponse;
        })
        .finally(() => {
          setLoadingState(useDashboard, 'getSuperAdminDashboardInfo', false);
        });
    },

    async getUserDashboardInfo() {
      setLoadingState(useDashboard, 'getUserDashboardInfo', true);
      return await getUserDashboardInfoAPI()
        .catch((err) => {
          setErrorState(useDashboard, 'getUserDashboardInfo', err);
          return {} as IUserDashboardInfo;
        })
        .finally(() => {
          setLoadingState(useDashboard, 'getUserDashboardInfo', false);
        });
    },
  }));
