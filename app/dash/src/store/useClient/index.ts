import { StoreApi, UseBoundStore, create } from 'zustand';

import { setLoadingState } from '../helpers/setStates';
import {
  archiveClientAPI,
  getClientInfoAPI,
  getClientsAPI,
  getRiskAssessmentsAPI,
  getUsersClientsAPI,
  removeLinkedUserAPI,
  postBankAccountDetailsAPI,
  postIndividualMetadataAPI,
  postLinkedUserAPI,
  submitRiskAssessmentAPI,
  updateDetailsOfRegistrarAPI,
  getClientsByIdAPI,
  updateLinkedUserAPI,
  postBusinessMetadataAPI,
  postDirectorsAPI,
  postBrokersAPI,
  postShareholder,
  deleteShareholder,
  getSubAccountAPI,
  postLinkAccountCurrencyCloudAPI,
  postLinkAccountIfxAPI,
  changePassword,
  deleteBrokersAPI,
  getApprovalMetadataAPI,
  approvalMetadataAPI,
  rejectMetadataAPI,
  sendWelcomeEmailAPI,
} from './fetchers';
import { TActions, TState } from './types';

export const useClients: UseBoundStore<StoreApi<TState & TActions>> = create<
  TState & TActions
>((set) => ({
  clientSelected: null,
  masterClientSelected: null,
  isLoading: false,
  errors: {} as TState['errors'],
  loading: {} as TState['loading'],

  setClientSelected: (data) => {
    set({ clientSelected: data });
  },

  setMasterClientSelected: (data) => {
    set({ masterClientSelected: data });
  },

  getClients: async (payload) => {
    setLoadingState(useClients, 'getClients', true);

    return await getClientsAPI(payload).finally(() =>
      setLoadingState(useClients, 'getClients', false)
    );
  },

  getClientsById: async (clientId) => {
    await getClientsByIdAPI(clientId);
  },

  getRiskAssessments: async (payload) => {
    set({ isLoading: true });

    return await getRiskAssessmentsAPI(payload).finally(() =>
      set({ isLoading: false })
    );
  },

  getClientsInfo: async (clientId) => {
    const setClientSelected = useClients.getState().setClientSelected;
    set({ isLoading: true });

    await getClientInfoAPI(clientId)
      .then((response) => setClientSelected({ ...response, uuid: clientId }))
      .finally(() => set({ isLoading: false }));
  },

  archiveClient: async (clientId) => {
    set({ isLoading: true });

    return await archiveClientAPI(clientId).finally(() =>
      set({ isLoading: false })
    );
  },

  updateDetailsOfRegistrar: async (data) => {
    set({ isLoading: true });
    return await updateDetailsOfRegistrarAPI(data).finally(() =>
      set({ isLoading: false })
    );
  },

  getUsersClient: async (payload) => {
    setLoadingState(useClients, 'getUsersClient', true);

    return await getUsersClientsAPI(payload).finally(() => {
      setLoadingState(useClients, 'getUsersClient', false);
    });
  },

  getSubAccount: async () => {
    setLoadingState(useClients, 'getSubAccount', true);

    return await getSubAccountAPI().finally(() => {
      setLoadingState(useClients, 'getSubAccount', true);
    });
  },

  submitRiskAssessment: async (payload) => {
    setLoadingState(useClients, 'submitRiskAssessment', true);

    return await submitRiskAssessmentAPI(payload).finally(() => {
      setLoadingState(useClients, 'submitRiskAssessment', false);
    });
  },

  async removeLinkedUser(userId, clientId) {
    setLoadingState(useClients, 'removeLinkedUser', true);

    await removeLinkedUserAPI(userId, clientId).finally(() => {
      setLoadingState(useClients, 'removeLinkedUser', false);
    });
  },

  postLinkedUser: async (payload) => {
    setLoadingState(useClients, 'postLinkedUser', true);

    await postLinkedUserAPI(payload).finally(() => {
      setLoadingState(useClients, 'postLinkedUser', false);
    });
  },
  updateLinkedUser: async (payload) => {
    setLoadingState(useClients, 'updateLinkedUser', true);

    await updateLinkedUserAPI(payload).finally(() => {
      setLoadingState(useClients, 'updateLinkedUser', false);
    });
  },

  postBankAccountDetails: async (payload) => {
    setLoadingState(useClients, 'postBankAccountDetails', true);

    await postBankAccountDetailsAPI(payload).finally(() => {
      setLoadingState(useClients, 'postBankAccountDetails', false);
    });
  },

  postIndividualMetadata: async (payload) => {
    setLoadingState(useClients, 'postIndividualMetadata', true);

    await postIndividualMetadataAPI(payload).finally(() => {
      setLoadingState(useClients, 'postIndividualMetadata', false);
    });
  },

  postBusinessMetadata: async (payload) => {
    setLoadingState(useClients, 'postBusinessMetadata', true);

    await postBusinessMetadataAPI(payload).finally(() => {
      setLoadingState(useClients, 'postBusinessMetadata', false);
    });
  },

  postDirectors: async (payload) => {
    setLoadingState(useClients, 'postDirectors', true);

    await postDirectorsAPI(payload).finally(() => {
      setLoadingState(useClients, 'postDirectors', false);
    });
  },

  postBrokers: async (payload) => {
    setLoadingState(useClients, 'postBrokers', true);

    await postBrokersAPI(payload).finally(() => {
      setLoadingState(useClients, 'postBrokers', false);
    });
  },

  deleteBroker: async (payload) => {
    setLoadingState(useClients, 'deleteBroker', true);

    await deleteBrokersAPI(payload).finally(() => {
      setLoadingState(useClients, 'deleteBroker', false);
    });
  },

  postShareholder: async (payload) => {
    setLoadingState(useClients, 'postShareholder', true);

    await postShareholder(payload).finally(() => {
      setLoadingState(useClients, 'postShareholder', false);
    });
  },

  deleteShareholder: async (payload) => {
    setLoadingState(useClients, 'deleteShareholder', true);

    await deleteShareholder(payload).finally(() => {
      setLoadingState(useClients, 'deleteShareholder', false);
    });
  },

  postLinkAccountCurrencyCloud: async (payload) => {
    setLoadingState(useClients, 'postLinkAccountCurrencyCloud', true);

    await postLinkAccountCurrencyCloudAPI(payload).finally(() => {
      setLoadingState(useClients, 'postLinkAccountCurrencyCloud', false);
    });
  },

  postLinkAccountIFX: async (payload) => {
    setLoadingState(useClients, 'postLinkAccountIFX', true);

    await postLinkAccountIfxAPI(payload).finally(() => {
      setLoadingState(useClients, 'postLinkAccountIFX', false);
    });
  },

  changePassword: async (payload) => {
    setLoadingState(useClients, 'changePassword', true);

    await changePassword(payload).finally(() => {
      setLoadingState(useClients, 'changePassword', false);
    });
  },

  getApprovalMetadata: async (payload) => {
    setLoadingState(useClients, 'getApprovalMetadata', true);

    return await getApprovalMetadataAPI(payload).finally(() => {
      setLoadingState(useClients, 'getApprovalMetadata', false);
    });
  },

  approveMetadata: async (payload) => {
    setLoadingState(useClients, 'approveMetadata', true);

    return await approvalMetadataAPI(payload).finally(() => {
      setLoadingState(useClients, 'approveMetadata', false);
    });
  },

  rejectMetadata: async (payload) => {
    setLoadingState(useClients, 'rejectMetadata', true);

    return await rejectMetadataAPI(payload).finally(() => {
      setLoadingState(useClients, 'rejectMetadata', false);
    });
  },

  sendWelcomeEmail: async (payload) => {
    setLoadingState(useClients, 'sendWelcomeEmail', true);

    return await sendWelcomeEmailAPI(payload).finally(() => {
      setLoadingState(useClients, 'sendWelcomeEmail', false);
    });
  },
}));
