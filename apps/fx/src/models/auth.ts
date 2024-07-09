import { EnumEntityType } from './entityType';

/* eslint-disable @typescript-eslint/no-explicit-any */
export enum UserRole {
  /** CDAX Super Admin */
  SuperAdmin = 'admin:super',
  /** CDAX User with full dashboard access. */
  AdminUser = 'user:admin',
  /** CDAX User with full access except some admin functions. */
  TeamManager = 'user:manager',

  TeamMember = 'user:member',

  /** CDAX User with readonly access to the dashboard. */
  ViewerUser = 'user:viewer',
}

interface IContactUser {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  businessRole: UserRole;
  country: string;
  mobileNumber: string;
  isApproved: boolean;
  expectedVolumeOfTransactions: string;
  expectedValueOfTurnover: string;
  isSubAccount: boolean;
  complyLaunchId: string;
  complyLaunchResponse: string;
  individualMetadata: {
    uuid: string;
  };
}

interface IClientUser {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name: string;
}

interface IBankMetadataUser {
  uuid: string;
  bankName?: string;
  branch?: string;
  accountHolderName?: string;
  bankCountry?: string;
  currency?: string;
  sortCode?: string;
  accountNumber?: string;
  IBAN?: string;
  bicSwift?: string;
}

export interface IIndividualMetadataUser {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  firstname: string;
  lastname: string;
  formerName: string;
  otherName: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
  previousAddressLine1: string;
  previousAddressLine2: string;
  previousCity: string;
  previousPostcode: string;
  previousCountry: string;
  previousState: string;
  nationality: string;
  gender: string;
  identificationNumber: string;
  identificationType: string;
  occupation: string;
  employerName: string;
  employerAddress1: string;
  employerAddress2: string;
  employerAddress3: string;
  publicPosition: string;
  highProfilePosition: string;
}

interface IAccountUser {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  entityType: EnumEntityType;
  bankMetadata: IBankMetadataUser;
  individualMetadata: IIndividualMetadataUser;
  businessMetadata: IBusinessMetadata;
  cloudCurrencyId: string;
  openPaydId: string;
  isApproved: boolean;
}

export interface IBusinessMetadata {
  companyName: string;
  tradingName: string;
  websiteUrl: string;
  otherContactInfo: string;
  natureOfBusiness: string;
  companyRegistrationNumber: string;
  isVatRegistered: boolean;
  vatNumber: string;
  isPubliclyTrading: boolean;
  stockMarketLocation: string;
  stockMarket: string;
  isRegulated: boolean;
  regulatorName: string;
  legalEntity: string;
  email: string;
  otherTradingNames: string;
  companyType: string;
  countryOfRegistration: string;
  dateOfRegistration: string;
  telephoneNumber: string;
  dateOfIncorporation: string;
  statutoryProvision: string;
  registeredOffice1: string;
  registeredOffice1_address2: string;
  registeredOffice1_postcode: string;
  registeredOffice1_city: string;
  registeredOffice1_state: string;
  registeredOffice2: string;
  registeredOffice3: string;
  principalPlace: string;
  mailingAddress: string;
  address1: string;
  address2: string;
  previousOffice1: string;
  previousOffice2: string;
  previousOffice3: string;
  expectedActivity: string;
  expectedVolume: string;
}

interface ICurrentClientUser {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  account: IAccountUser;
}

export interface ICurrentUser {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: string;
  username: string;
  firstname: string;
  lastname: string;
  hasAcceptedTerms: boolean;
  verificationCode: string;
  role: UserRole;
  isMobile2FAEnabled: true;
  passwordUpdatedAt: string;
  contact: IContactUser;
  clients: Array<IClientUser>;
  currentClient: ICurrentClientUser;
  personatedBy?: string;
}

interface ICredentials {
  accessToken: string;
}

export interface IResponseAuth {
  user: ICurrentUser;
  credentials: ICredentials;
  is2FAOK: true;
  isMobile2FAEnabled: boolean;
}

export interface IClientAuthResponse {
  credentials: {
    accessToken: string;
  };
  user: ICurrentUser;
}

export const AllRoles = [
  UserRole.SuperAdmin,
  UserRole.AdminUser,
  UserRole.TeamManager,
  UserRole.TeamMember,
];

export const SuperOrAdminOrManager = [
  UserRole.SuperAdmin,
  UserRole.AdminUser,
  UserRole.TeamManager,
];

export const AdminOrManager = [UserRole.AdminUser, UserRole.TeamManager];

export const AdminRoles = [UserRole.SuperAdmin];
