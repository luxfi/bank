import { IBusinessMetadata, ICurrentUser, UserRole } from '@/models/auth';
import {
  IBankMetadata,
  IIndividualMetadata,
  IRiskAssessment,
} from '@/models/clients';
import { currenciesArray } from '@/models/countries';

import { IClientDocument } from '@/store/useClient/types';

import { IDefaultStates } from '../helpers/setStates';

export type TState = IDefaultStates<TActions> & {
  isLoading: boolean;
  currentUser: ICurrentUser | null;

  currentClientInfo: {
    user: IUserRiskRating;
    client: ICurrentClientInfo;
    ownerMetadata?: IOwnerMetadata;
  };
};

export type TActions = {
  setUser(data: ICurrentUser): void;
  setClearUser(): void;
  setReturnWithSuperAdminUser(): Promise<void>;

  setChangeUserImpersonateAndCurrentUser(user: ICurrentUser): void;

  setCheckAuthenticatedUser(): Promise<ICurrentUser | null>;

  setImpersonate(payload: IPayloadImpersonate): Promise<void>;

  set2fa(
    payload: IPayload2Fa
  ): Promise<{ accessToken: string; user: ICurrentUser }>;

  setSignIn(payload: ISignInPayload): Promise<void>;
  setSend2Fa(payload: 'sms' | 'email'): Promise<void>;
  setForgotPassword(email: string): Promise<void>;

  getCurrentClientInfo(): Promise<{
    user: IUserRiskRating | null;
    client: ICurrentClientInfo | null;
  }>;

  setChangeClient: (id: string) => Promise<void>;

  setSignOut(): void;
};

export interface ICurrentImpersonate extends IImpersonateResponse {
  isActive: boolean;
  type?: string;
  name?: string;
}

export interface IPayloadImpersonate {
  userUuid: string;
  clientUuid: string;
}

export interface ISignInPayload {
  username: string;
  password: string;
  r: string;
}

export interface IImpersonateResponse {
  user: ICurrentUser;
  credentials: {
    accessToken: string;
    superAdminToken: string;
  };
}

export interface IPayload2Fa {
  code: string;
  provider: string;
}

export interface ICurrentClientInfo {
  account: IClientInfoAccount;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
  name: string;
  documents: Array<IClientDocument>;
  uuid: string;
}

export interface IOwnerMetadata {
  metadata: {
    uuid: string;
    userClient: string;
    role: UserRole;
    phoneNumber?: string;
    whoTheyAre?: string;
  };
  firstName: string;
  lastName: string;
  name: string;
  email: string;
}

export interface IClientInfoAccount {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  entityType: 'individual' | 'business';
  bankMetadata: IBankMetadata;
  individualMetadata: IIndividualMetadata | null;
  riskAssessments: Array<IRiskAssessment>;
  cloudCurrencyId: string;
  openPaydId: string;
  gatewayId: string;
  gateway: 'currencycloud' | 'openpayd';
  isApproved: boolean;
  credentials: string;
  deletedAt: string;
  businessMetadata: IBusinessMetadata | null;
  archivedAt: string;
  fee: string;
}

export interface IUserRiskRating {
  businessRole: string;
  country: keyof typeof currenciesArray;
  documents: Array<IClientDocument>;
  email: string;
  entityType: 'individual' | 'business';
  expectedValueOfTurnover: string;
  expectedVolumeOfTransactions: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  riskAssessment: IRiskAssessment;
  role: UserRole;
  uuid: string;
}

export const PATHS = {
  LOGIN: '/api/v1/auth/login',
  CURRENT_USER: '/api/v1/users/current',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  CHECK_2FA_CODE: '/api/v1/2fa/verification/check',
  SEND_2FA_CODE: '/api/v1/2fa/verification/send',
  CHANGE_CLIENT: (id: string) => `/api/v1/clients/${id}`,
  CURRENT_CLIENT_INFO: '/api/v1/clients/current',
  IMPERSONATE: '/api/v1/auth/impersonate',
  GET_USER: '/api/v1/users/impersonate',
};
