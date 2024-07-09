import { create } from 'zustand';

import { setErrorState, setLoadingState } from '../helpers/setStates';
import { IDocument } from '../useClient/types';
import {
  deleteClientDocumentAPI,
  downloadClientDocumentAPI,
  linkDocumentToClientAPI,
  uploadClientDocumentAPI,
} from './fetchers';
import {
  IDocumentsActions,
  IDocumentsStates,
  ILinkDocumentToClient,
} from './types';

type TUseDocuments = IDocumentsStates & IDocumentsActions;

export const useDocuments = create<TUseDocuments>(() => ({
  loading: {} as IDocumentsStates['loading'],
  errors: {} as IDocumentsStates['errors'],

  async uploadClientDocuments(file: FormData) {
    setLoadingState(useDocuments, 'uploadClientDocuments', true);

    return await uploadClientDocumentAPI(file)
      .then((res) => {
        setLoadingState(useDocuments, 'uploadClientDocuments', false);
        return res;
      })
      .catch((err) => {
        setErrorState(useDocuments, 'uploadClientDocuments', err);
        return {} as IDocument;
      })
      .finally(() => {
        setLoadingState(useDocuments, 'uploadClientDocuments', false);
      });
  },

  async deleteClientDocument(id) {
    setLoadingState(useDocuments, 'deleteClientDocument', true);

    await deleteClientDocumentAPI(id)
      .then(() => {
        setLoadingState(useDocuments, 'deleteClientDocument', false);
      })
      .catch((err) => {
        setErrorState(useDocuments, 'deleteClientDocument', err);
      })
      .finally(() => {
        setLoadingState(useDocuments, 'deleteClientDocument', false);
      });
  },

  async downloadClientDocument(id) {
    setLoadingState(useDocuments, 'downloadClientDocument', true);

    return await downloadClientDocumentAPI(id)
      .then((res) => {
        setLoadingState(useDocuments, 'downloadClientDocument', false);
        return res;
      })
      .catch((err) => {
        setErrorState(useDocuments, 'downloadClientDocument', err);
        return '';
      })
      .finally(() => {
        setLoadingState(useDocuments, 'downloadClientDocument', false);
      });
  },

  async linkDocumentToClient(payload: ILinkDocumentToClient) {
    setLoadingState(useDocuments, 'linkDocumentToClient', true);

    await linkDocumentToClientAPI(payload)
      .then(() => {
        setLoadingState(useDocuments, 'linkDocumentToClient', false);
      })
      .catch((err) => {
        setErrorState(useDocuments, 'linkDocumentToClient', err);
      })
      .finally(() => {
        setLoadingState(useDocuments, 'linkDocumentToClient', false);
      });
  },
}));
