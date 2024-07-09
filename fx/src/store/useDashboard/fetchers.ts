import { dataFetch } from '@/api/fetchers';

import {
  ISuperAdminDashboardInfoReponse,
  IUserDashboardInfo,
  PATHS,
} from './types';

export async function getSuperAdminDashboardInfoAPI(): Promise<ISuperAdminDashboardInfoReponse> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.SUPER_ADMIN_DASHBOARD_INFO,
      method: 'GET',
    });

    if (response.message) {
      throw new Error('Unable to get Dashboard Info');
    }

    return response.data;
  } catch (error) {
    throw new Error('Unable to get Dashboard Info');
  }
}
export async function getUserDashboardInfoAPI(): Promise<IUserDashboardInfo> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.USER_DASHBOARD_INFO,
      method: 'GET',
    });

    if (response.message) {
      throw new Error('Unable to get Dashboard Info');
    }

    return response.data;
  } catch (error) {
    throw new Error('Unable to get Dashboard Info');
  }
}
