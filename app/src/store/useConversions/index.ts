import { create } from 'zustand';

import { postConversionAPI, postConversionPreviewAPI } from './fetchers';
import { TActions, TState } from './types';

export const useConversions = create<TState & TActions>((set) => ({
  isLoading: false,

  setConversion: async (payload) => {
    set({ isLoading: true });

    return await postConversionAPI(payload).finally(() =>
      set({ isLoading: false })
    );
  },

  setConversionPreview: async (payload) => {
    set({ isLoading: true });

    return await postConversionPreviewAPI(payload).finally(() =>
      set({ isLoading: false })
    );
  },
}));
