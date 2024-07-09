import { create } from 'zustand';

import { setLoadingState } from '../helpers/setStates';
import {
  updateBusinessAddressAPI,
  updateBusinessDetailsOfRegistrarAPI,
  updateIndividualAddressAPI,
  updateIndividualEmploymentDetailsAPI,
  updateIndividualPersonalDetailsAPI,
} from './fetchers';
import {
  IPayloadUpdateBusinessAddress,
  IPayloadUpdateBusinessDetailsOfRegistrar,
  IPayloadUpdateIndividualAddress,
  IPayloadUpdateIndividualEmploymentDetails,
  IPayloadUpdateIndividualPersonalDetails,
  TActions,
  TState,
} from './types';

export const useManageAccount = create<TState & TActions>(() => ({
  isLoading: false,
  errors: {} as TState['errors'],
  loading: {} as TState['loading'],

  updateIndividualPersonalDetails: async (
    payload: IPayloadUpdateIndividualPersonalDetails
  ) => {
    setLoadingState(useManageAccount, 'updateIndividualPersonalDetails', true);

    await updateIndividualPersonalDetailsAPI(payload).finally(() => {
      setLoadingState(
        useManageAccount,
        'updateIndividualPersonalDetails',
        false
      );
    });
  },

  updateIndividualAddress: async (payload: IPayloadUpdateIndividualAddress) => {
    setLoadingState(useManageAccount, 'updateIndividualAddress', true);

    await updateIndividualAddressAPI(payload).finally(() => {
      setLoadingState(useManageAccount, 'updateIndividualAddress', false);
    });
  },

  updateIndividualEmploymentDetails: async (
    payload: IPayloadUpdateIndividualEmploymentDetails
  ) => {
    setLoadingState(
      useManageAccount,
      'updateIndividualEmploymentDetails',
      true
    );

    await updateIndividualEmploymentDetailsAPI(payload).finally(() => {
      setLoadingState(
        useManageAccount,
        'updateIndividualEmploymentDetails',
        false
      );
    });
  },

  updateBusinessAddress: async (payload: IPayloadUpdateBusinessAddress) => {
    setLoadingState(useManageAccount, 'updateBusinessAddress', true);

    await updateBusinessAddressAPI(payload).finally(() => {
      setLoadingState(useManageAccount, 'updateBusinessAddress', false);
    });
  },

  updateBusinessDetailsOfRegistrar: async (
    payload: IPayloadUpdateBusinessDetailsOfRegistrar
  ) => {
    setLoadingState(useManageAccount, 'updateBusinessDetailsOfRegistrar', true);

    await updateBusinessDetailsOfRegistrarAPI(payload).finally(() => {
      setLoadingState(
        useManageAccount,
        'updateBusinessDetailsOfRegistrar',
        false
      );
    });
  },
}));
