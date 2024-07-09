import { IPaginationResponse } from '@/models/pagination';

import { StoreApi, UseBoundStore, create } from 'zustand';

import { setErrorState, setLoadingState } from '../helpers/setStates';
import * as api from './fetchers';
import { IBeneficiariesActions, IBeneficiariesStates } from './types';

type TUseBeneficiaries = IBeneficiariesStates & IBeneficiariesActions;

export const useBeneficiaries: UseBoundStore<StoreApi<TUseBeneficiaries>> =
  create<TUseBeneficiaries>(() => ({
    loading: {} as IBeneficiariesStates['loading'],
    errors: {} as IBeneficiariesStates['errors'],

    async getBeneficiaries(payload) {
      setLoadingState(useBeneficiaries, 'getBeneficiaries', true);
      return await api
        .getBeneficiariesAPI(payload)
        .then(({ data, pagination }) => {
          return {
            data,
            pagination,
          };
        })
        .catch((err) => {
          setErrorState(useBeneficiaries, 'getBeneficiaries', err);
          return {
            data: [],
            pagination: {} as IPaginationResponse,
          };
        })
        .finally(() => {
          setLoadingState(useBeneficiaries, 'getBeneficiaries', false);
        });
    },
  }));
