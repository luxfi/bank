import { IPaginationResponse } from '@/models/pagination';

import { dataFetch } from '@/api/fetchers';

import { IFilterSelectPayload, PATHS } from './types';

async function getUsersSelect(payload: IFilterSelectPayload) {
  try {
    const response = await dataFetch({
      endpoint: PATHS.USERS_SELECT,
      method: 'GET',
      urlParams: payload as unknown as Record<string, string>,
    });

    if (response.message) {
      throw new Error('Unable to get Users');
    }

    return {
      data: response.data || [],
      pagination: response.pagination || ({} as IPaginationResponse),
    };
  } catch (err) {
    throw new Error('Unable to get Users');
  }
}

async function getClientsSelect(payload: IFilterSelectPayload) {
  try {
    const response = await dataFetch({
      endpoint: PATHS.CLIENTS_SELECT,
      method: 'GET',
      urlParams: payload as unknown as Record<string, string>,
    });

    if (response.message) {
      throw new Error('Unable to get Clients');
    }

    return {
      data: response.data || [],
      pagination: response.pagination || ({} as IPaginationResponse),
    };
  } catch (err) {
    throw new Error('Unable to get Clients');
  }
}

async function getBeneficiariesSelect(payload: IFilterSelectPayload) {
  try {
    const response = await dataFetch({
      endpoint: PATHS.BENEFICIARIES_SELECT,
      method: 'GET',
      urlParams: payload as unknown as Record<string, string>,
    });

    if (response.message) {
      throw new Error('Unable to get Beneficiaries');
    }

    return {
      data: response.data || [],
      pagination: response.pagination || ({} as IPaginationResponse),
    };
  } catch (err) {
    throw new Error('Unable to get Beneficiaries');
  }
}

export {
  getUsersSelect,
  getClientsSelect as gerClientsSelect,
  getBeneficiariesSelect,
};
