import { IDefaultStates } from '../helpers/setStates';

export interface IFilterSelectPayload {
  name?: string;
  page: number;
  limit: number;
}

export interface IFilterSelect {
  id: string;
  name: string;
  email?: string;
}

export interface IFilterSelectStates
  extends IDefaultStates<IFilterSelectActions> {}

export interface IFilterSelectActions {
  getUsersSelect: (payload: IFilterSelectPayload) => Promise<IFilterSelect[]>;
  getClientsSelect: (payload: IFilterSelectPayload) => Promise<IFilterSelect[]>;
  getBeneficiariesSelect: (
    payload: IFilterSelectPayload
  ) => Promise<IFilterSelect[]>;
}

export const PATHS = {
  USERS_SELECT: '/api/v2.1/users/select',
  CLIENTS_SELECT: '/api/v1/clients/select',
  BENEFICIARIES_SELECT: '/api/v2/beneficiaries/select',
};
