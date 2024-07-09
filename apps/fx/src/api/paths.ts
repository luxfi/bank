export const AUTH = {
  LOGIN: '/api/v1/auth/login',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  CHECK_2FA_CODE: '/api/v1/2fa/verification/check',
  SEND_2FA_CODE: '/api/v1/2fa/verification/send',
};

export const DASHBOARD = {
  INFO: `/api/v1/currencycloud/dashboard-info`,
};

export const USER = {
  CURRENT: '/api/v1/users/current',
  GET_CURRENT_USER_V2: '/api/v2/users/current',
  UPDATE_CURRENT_USER_V2: '/api/v2/users/current',
  GET_USER: (uuid: string) => `/api/v1/admin/users/${uuid}`,
  UPDATE_ADMIN_USER: (uuid: string) => `/api/v1/admin/users/${uuid}`,
  ARCHIVE_USER: (uuid: string) => `/api/v1/admin/users/${uuid}`,
  CREATE_USER: '/api/v1/admin/users',
  UPDATE_USER: (uuid: string) => `/api/v1/users/${uuid}`,
  RESET_PASSWORD: `/api/v1/users/current/reset-password`,
  METADATA: `/api/v1/users/current/metadata`,
};

export const CLIENTS = {
  GET: '/api/v1/admin/clients',
  SUB_ACCOUNT: '/api/v1/currencycloud/subaccounts?page=1&limit=1000',
  GET_ID: (uuid: string) => `/api/v1/clients/${uuid}`,
  NEW_CLIENT: '/api/v1/admin/clients',
  DELETE: (uuid: string) => `/api/v1/admin/clients/${uuid}`,
  POST: (uuid: string) => `/api/v1/admin/clients/${uuid}`,
  PERSONAL_DETAILS: (uuid: string) => `/api/v1/admin/clients/${uuid}/metadata`,
  EMPLOYMENT_DETAILS: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/metadata`,
  RESET_PASSWORD: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/reset-password`,
  LINK_USER: '/api/v1/admin/users/link-user',
  LINK_USER_DELETE: (uuid: string) =>
    `/api/v1/admin/users/remove-link-user/${uuid}`,
  COMPANY_DETAILS: (uuid: string) => `/api/v1/admin/clients/${uuid}/metadata`,
  ADDRESS: (uuid: string) => `/api/v1/admin/clients/${uuid}/metadata`,
  DOCUMENTS: () => `/api/v1/documents`,
  DIRECTORS: (uuid: string) => `/api/v1/admin/clients/${uuid}/metadata`,
  BROKERS: (uuid: string) => `/api/v1/admin/clients/${uuid}/metadata`,
  EXPECTED_ACTIVITY: (uuid: string) => `/api/v1/admin/clients/${uuid}/metadata`,
  BANK_ACCOUNT: (uuid: string) => `/api/v1/admin/clients/${uuid}/metadata`,
  RISK_ASSESSMENT: (uuid: string) => `/api/v1/admin/clients/${uuid}/metadata`,
};

export const BENEFICIARIES = {
  REVIEW: '/api/v1/beneficiaries/review',
  CREATE: (uuid?: string) => `/api/v2/beneficiaries${uuid ? `/${uuid}` : ''}`,
  LIST: '/api/v2/beneficiaries',
  RECENT_PAID: '/api/v2/beneficiaries/recent-paid',
  UPDATE: (uuid: string) => `/api/v2/beneficiaries/${uuid}`,
  DELETE: (uuid: string) => `/api/v2/beneficiaries/${uuid}`,
  BY_ID: (uuid: string) => `/api/v2/beneficiaries/${uuid}`,
  APPROVE: (uuid: string) => `/api/v2/beneficiaries/approve/${uuid}`,
  DISAPPROVE: (uuid: string) => `/api/v2/beneficiaries/disapprove/${uuid}`,
  CURRENCY: (currency: string) =>
    `/api/v2/beneficiaries?currency=${currency}&status=approved&limit=1000`,
};

export const USERS = {
  GET_USERS: (roles: string, page: string, limit: string) =>
    `/api/v1/admin/users?roles=${roles}&page=${page}&limit=${limit}`,
  GET_ARCHIVED_USERS: `/api/v1/admin/clients/archived`,
  RESTORE_USER: (uuid: string) => `/api/v1/admin/clients/${uuid}/restore`,
  ARCHIVED: (uuid: string) => `/api/v1/admin/users/${uuid}`,
};

export const REGISTRATION = {
  GET: (uuid: string) => `/api/v1/invitations/${uuid}`,
  REQUEST_REGISTRATION: '/api/v1/invitations/access',
  SUBMIT_USER_INVITATION: '/api/v1/invitations',
  EMAIL_EXISTS: (encodedEmail: string) =>
    `/api/v1/admin/users/${encodedEmail}/exists`,
};

export const SEARCH = {
  TRANSACTIONS: '/api/v2/transactions/',
  TRANSACTION_DETAILS: (id: string) => `/api/v2/transactions/${id}`,
};

export const PAYMENT = {
  DELIVERY_DATE: `/api/v1/currencycloud/delivery_date`,
  CREATE_PAYMENT: `/api/v2/payments`,
  REJECT_PAYMENT: (id: string) => `/api/v2/payments/reject_payment/${id}`,
  APPROVE_PAYMENT: (id: string) => `/api/v2/payments/approve_payment/${id}`,
};
