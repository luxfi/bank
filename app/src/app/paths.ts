export const AUTH_PATHS = {
  AUTH_2FA: '/2fa',
};

export const APP_PATHS = {
  DASHBOARD: {
    ROOT: '/dashboard',
  },

  CLIENTS: {
    ROOT: '/clients',
    NEW: '/clients/new',
    PROFILE: (uuid: string, clientId: string) =>
      `/clients/${uuid}/profile?clientId=${clientId}`,
  },

  BENEFICIARIES: {
    ROOT: '/beneficiaries',
    DETAIL: (uuid: string) => `/beneficiaries/${uuid}`,
  },

  IN_APPROVAL: {
    ROOT: '/in-approval',
    DETAIL: (uuid: string) => `/in-approval/${uuid}`,
  },

  TRANSACTIONS: {
    ROOT: '/transactions',
  },
};
