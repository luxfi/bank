import { AnyAction, Middleware } from "@reduxjs/toolkit";
import {
  AccountResponse,
  BusinessMetadata,
  ContactResponse,
} from "../features/accounts/model/account-response";
import { User } from "../features/auth/AuthApi";
import { UserRole } from "../features/auth/user-role.enum";
import { EntityType } from "../features/registration/RegistrationSlice";
import { IndividualMetadataDto } from "../features/registration/model/individualMetadataSchema";

// !Interface for new user structure (comming from api) to implementation of the new front-end.
export interface IUserResponse {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  firstname: string;
  lastname: string;
  hasAcceptedTerms: boolean;
  verificationCode: string;
  role: UserRole;
  isMobile2FAEnabled: boolean;
  passwordUpdatedAt: string;
  contact: IContact;
  clients: Array<IClient>;
  currentClient: ICurrentClient;
}
export interface IClient {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  firstname: string;
  lastname: string;
  name: string;
}

export interface ICurrentClient extends IClient {
  account: IAccount;
}

export interface IContact {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  businessRole: string;
  country: string;
  mobileNumber: string;
  isApproved: boolean;
  expectedVolumeOfTransactions: string;
  expectedValueOfTurnover: string;
  isSubAccount: boolean;
  complyLaunchId: string;
  complyLaunchResponse: string;
}

export interface IAccount {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  entityType: EntityType;
  cloudCurrencyId: string;
  openPaydId: string;
  isApproved: boolean;
  individualMetadata?: IndividualMetadataDto;
  businessMetadata?: BusinessMetadata;
  bankMetadata: {
    uuid: string;
  };
}

//!============================================================================

export const ConvertUserMiddleware: Middleware =
  (store) => (next) => (action) => {
    const canConvert = [
      "auth/login/fulfilled",
      "auth/login2FA/fulfilled",
      "auth/setCurrentUser",
      "user/changeCurrentClient/fulfilled",
    ];

    if (!canConvert.find((value) => value === action.type)) return next(action);

    const userApiData: IUserResponse = action.payload;
    //console.log(userApiData, "user_debug API_RESP");

    const user: User = {} as User;
    const contact: ContactResponse = {} as ContactResponse;
    const account: AccountResponse = {} as AccountResponse;

    Object.assign(user, userApiData);

    if (userApiData.currentClient) {
      Object.assign(user, userApiData.currentClient);
      Object.assign(user, {uuid: userApiData.uuid});
    }

    if (userApiData.currentClient?.account?.isApproved) {
      Object.assign(user, {
        isApproved: userApiData.currentClient.account.isApproved,
      });
    }
    if (userApiData.currentClient?.account?.entityType) {
      Object.assign(user, {
        accountType: userApiData.currentClient.account.entityType,
      });
    }

    if (
      userApiData.currentClient?.account?.individualMetadata ||
      userApiData.currentClient?.account?.businessMetadata
    ) {
      user.isMetadataSet = true;
    }

    if (userApiData.contact) {
      Object.assign(contact, userApiData.contact);
      user.contact = contact;
    }

    if (userApiData.currentClient?.account) {
      Object.assign(account, userApiData.currentClient.account);
      user.contact.account = account as AccountResponse;
    }

    const newAction: AnyAction = {
      ...action,
      payload: user,
    };

    //console.log(user, "user_debug USER");

    return next(newAction);
  };
