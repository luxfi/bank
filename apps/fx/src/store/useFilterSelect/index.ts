import { StoreApi, UseBoundStore, create } from 'zustand';

import { setErrorState, setLoadingState } from '../helpers/setStates';
import * as api from './fetchers';
import { IFilterSelectActions, IFilterSelectStates } from './types';

type TUseFiltersSelect = IFilterSelectStates & IFilterSelectActions;

export const useFilterSelect: UseBoundStore<StoreApi<TUseFiltersSelect>> =
  create<TUseFiltersSelect>(() => ({
    loading: {} as IFilterSelectStates['loading'],
    errors: {} as IFilterSelectStates['errors'],

    async getUsersSelect(payload) {
      setLoadingState(useFilterSelect, 'getUsersSelect', true);

      return await api
        .getUsersSelect(payload)
        .then(({ data }) => {
          return data;
        })
        .catch((err) => {
          setErrorState(useFilterSelect, 'getUsersSelect', err);
          return [];
        })
        .finally(() =>
          setLoadingState(useFilterSelect, 'getUsersSelect', false)
        );
    },
    async getClientsSelect(payload) {
      setLoadingState(useFilterSelect, 'getClientsSelect', true);

      return await api
        .gerClientsSelect(payload)
        .then(({ data }) => {
          return data;
        })
        .catch((err) => {
          setErrorState(useFilterSelect, 'getClientsSelect', err);
          return [];
        })
        .finally(() =>
          setLoadingState(useFilterSelect, 'getClientsSelect', false)
        );
    },
    async getBeneficiariesSelect(payload) {
      setLoadingState(useFilterSelect, 'getBeneficiariesSelect', true);

      return await api
        .getBeneficiariesSelect(payload)
        .then(({ data }) => {
          return data;
        })
        .catch((err) => {
          setErrorState(useFilterSelect, 'getBeneficiariesSelect', err);
          return [];
        })
        .finally(() =>
          setLoadingState(useFilterSelect, 'getBeneficiariesSelect', false)
        );
    },
  }));
