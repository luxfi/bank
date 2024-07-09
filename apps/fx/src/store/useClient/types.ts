import { UserRole } from '@/models/auth';
import { IClients } from '@/models/clients';
import { EnumGateway } from '@/models/gateway';
import { IPaginationResponse } from '@/models/pagination';
import { TUserStatus } from '@/models/users';

import { IDefaultStates } from '../helpers/setStates';
import { EnumClientDocumentType } from '../useDocuments/types';

export type TState = IDefaultStates<TActions> & {
  isLoading: boolean;
  clientSelected?: IClientInfoResponse | null;
  masterClientSelected?: IMasterClientSelected | null;
};

export type TActions = {
  setClientSelected(data: IClientInfoResponse): void;
  setMasterClientSelected(data: IMasterClientSelected): void;

  getClients(payload: IPayloadGetClients): Promise<IGetClientsResponse>;
  getClientsById(clientId: string): Promise<any>;
  getClientsInfo(clientId: string): Promise<void>;
  getSubAccount(): Promise<Array<IResponseSubAccount>>;

  archiveClient(clientId: string): Promise<IGetClientsResponse>;
  updateDetailsOfRegistrar(
    data: IUpdateDetailOfRegistrarPayload
  ): Promise<void>;

  updateLinkedUser(payload: IUpdateLinkedUserPayload): Promise<void>;

  getUsersClient(payload: IUsersClientsPayload): Promise<IUserClientResponse>;

  getRiskAssessments(
    payload: IPayloadGetClients
  ): Promise<IGetRiskAssessmentsResponse>;

  submitRiskAssessment(
    payload: IPayloadRiskAssessment
  ): Promise<IRiskAssessment>;

  removeLinkedUser(userId: string, clientId: string): Promise<void>;

  postLinkedUser(payload: ILinkUserPayload): Promise<void>;
  postBankAccountDetails(payload: IPayloadBankMetadata): Promise<void>;

  postIndividualMetadata(payload: IPayloadIndividualMetadata): Promise<void>;
  postBusinessMetadata(payload: IPayloadBusinessMetadata): Promise<void>;

  postDirectors(payload: IPayloadDirectors): Promise<void>;
  postBrokers(payload: IPayloadBrokers): Promise<void>;

  deleteBroker(payload: IPayloadBrokers): Promise<void>;

  postShareholder(payload: IPostShareholder): Promise<void>;
  deleteShareholder(payload: IDeleteShareholderPayload): Promise<void>;

  postLinkAccountCurrencyCloud(
    payload: IPayloadLinkAccountCurrencyCloud
  ): Promise<void>;

  postLinkAccountIFX(payload: IPayloadLinkAccountIFX): Promise<void>;

  changePassword(payload: IPayloadChangePassword): Promise<void>;

  getApprovalMetadata(
    payload: IPayloadGetApprovalMetadata
  ): Promise<IGetApprovalMetadataResponse>;

  approveMetadata(payload: IPayloadApproveMetadata): Promise<void>;
  rejectMetadata(payload: IPayloadRejectMetadata): Promise<void>;
  sendWelcomeEmail(payload: IPayloadSendWelcomeEmail): Promise<void>;
};

export interface IPayloadGetClients {
  page: number;
  limit: number;
  status?: string;
  riskRating?: string;
}

export interface IPayloadLinkAccountCurrencyCloud {
  contactId: string;
  clientId: string;
  masterClientId: string;
}

export interface IPayloadLinkAccountIFX {
  masterClientId: string;
  clientId: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    username: string;
    password: string;
  };
}

export interface IPayloadIndividualMetadata {
  masterClientId: string;
  clientUuid: string;
  individualMetadata: IIndividualMetadata;
}

export interface IPayloadBusinessMetadata {
  masterClientId: string;
  clientUuid: string;
  businessMetadata: IBusinessMetadata;
}

export interface IPayloadBankMetadata {
  masterClientId: string;
  clientUuid: string;
  bankMetadata: IBankMetadata;
}

export interface IPayloadDirectors {
  masterClientId: string;
  clientUuid: string;
  directors: Array<IDirector>;
}

export interface IPayloadBrokers {
  masterClientId: string;
  clientUuid: string;
  brokers: Array<IBroker>;
}

export interface IGetClientsResponse {
  data: Array<IClients>;
  count: number;
}

export interface ILinkedUser extends Omit<IMasterClientSelected, 'contact'> {
  contact: string;
  role: UserRole;
  status: TUserStatus;
}
export interface IClientInfoResponse {
  //linkedUsers: Array<INewUser>;
  linkedUsers: Array<ILinkedUser>;
  uuid: string;
  linkedClient: keyof typeof EnumGateway;
  businessMetadata: IBusinessMetadata;
  individualMetadata: IIndividualMetadata;
  bankMetadata?: IBankMetadata;
  riskAssessment: IRiskAssessment;
  brokers: Array<IBroker>;
  shareholders: Array<IShareholder>;
  directors: Array<IDirector>;
  documents: Array<IClientDocument>;
  accountUuid: string;
}

export interface IClientDocument {
  client: string;
  createdAt: string;
  deletedAt: string;
  isApproved: boolean;
  type: EnumClientDocumentType;
  updatedAt: string;
  uuid: string;
  document: IDocument;
}

export interface IDocument {
  createdAt: string;
  creator: string;
  deletedAt: string;
  originalFilename: string;
  ownCloudPath: string;
  updatedAt: string;
  uuid: string;
}

export interface IGetRiskAssessments {
  id: string;
  country: string;
  PEP: string;
  lastRA: Date;
  nestRA: Date;
  type: string;
  riskRating: string;
}

export interface IGetRiskAssessmentsResponse {
  data: Array<IGetRiskAssessments>;
  pagination: IPaginationResponse;
}

export const PATHS = {
  GET: '/api/v1/admin/clients',
  GET_BY_ID: (clientId: string) => `/api/v1/admin/clients/${clientId}`,
  GET_INFO: (clientId: string) => `/api/v1/admin/clients/info/${clientId}`,
  GET_SUB_ACCOUNT: '/api/v1/currencycloud/subaccounts?page=1&limit=1000',

  POST_RISK_ASSESSMENT: (clientId: string) =>
    `/api/v1/admin/clients/risk-assessments/${clientId}`,
  GET_USERS_CLIENTS: (uuid: string) => `/api/v1/admin/users/client/${uuid}`,

  ARCHIVE: (uuid: string) => `/api/v1/admin/clients/${uuid}`,
  POST: (uuid: string) => `/api/v1/admin/clients/${uuid}`,

  POST_INDIVIDUAL_METADATA: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/metadata`,
  POST_BUSINESS_METADATA: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/metadata`,
  POST_BANK_ACCOUNT: (uuid: string) => `/api/v1/admin/clients/${uuid}/metadata`,

  GET_RISK_ASSESSMENTS: `/api/v1/clients/risk-assessments`,
  UPDATE_LINKED_USER: (id: string) => `/api/v1/admin/users/${id}`,
  POST_LINKED_USER: '/api/v1/admin/users/link-user',
  REMOVE_LINKED_USER: (userId: string, clientId: string) =>
    `/api/v1/admin/users/remove-link-user/${userId}/client/${clientId}`,

  POST_SHAREHOLDER: (uuid: string) => `/api/v1/admin/clients/${uuid}/metadata`,
  POST_LINK_ACCOUNT_CURRENCY_CLOUD: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/currency-cloud-data`,

  POST_LINK_ACCOUNT_IFX: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/ifx-link-data`,

  CHANGE_PASSWORD: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/reset-password`,

  GET_APPROVAL_METADATA: (uuid: string, session: IApprovelMetadataSession) =>
    `/api/v1/admin/clients/${uuid}/metadata?session=${session}`,

  APPROVE_METADATA: (uuid: string, tempId: string) =>
    `/api/v1/admin/clients/${uuid}/approve-temp-change/${tempId}`,
  REJECT_METADATA: (uuid: string, tempId: string) =>
    `/api/v1/admin/clients/${uuid}/reject-temp-change/${tempId}`,
  SEND_WELCOME_EMAIL: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/send-welcome-email`,
};

export interface IMasterClientSelected {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  username: string;
  firstname: string;
  lastname: string;
  profileImage: string | null;
  hasAcceptedTerms: boolean;
  archivedAt: Date | null;
  invitedBy: string | null;
  verificationCode: string | null;
  verifiedAt: string | null;
  twoFASecret: string | null;
  twoFA: string | null;
  isMobile2FAEnabled: boolean;
  passwordUpdatedAt: Date | null;
  contact: {
    uuid: string;
    user: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    businessRole: string;
    country: string;
    mobileNumber: string;
    isApproved: boolean;
    isSubAccount: boolean;
    deletedAt: Date | null;
    cloudCurrencyId: string | null;
    openPaydId: string | null;
    expectedVolumeOfTransactions: string | null;
    expectedValueOfTurnover: string | null;
    complyLaunchId: string | null;
    complyLaunchResponse: string | null;
    currencyCloudPasswordUrl: string | null;
  };
}

export interface ILinkUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  country: string;
  clientId: string;
  mobileNumber: string;
}

export interface IResponseSubAccount {
  accountHolderId: string;
  clientType: string;
  friendlyName: string;
  taken: boolean;
}

export interface IUpdateLinkedUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  clientId: string;
  mobileNumber: string;
  uuid: string;
  linked_user_uuid: string;
  role: string;
  country: string;
}

export interface IUsersClientsPayload {
  clientUuid: string;
  page: number;
  limit: number;
  roles?: UserRole;
  status?: 'verified' | 'unverified';
  archived?: 'archived' | 'unarchived';
  name?: string;
}

export interface IUpdateDetailOfRegistrarPayload {
  uuid: string;
  businessRole: string;
  country: string;
  email: string;
  entityType: string;
  firstname: string;
  lastname: string;
  mobileNumber: string;
  skipWelcomeEmail: string;
  verifiedAt: string;
}

export interface IUserClientResponse {
  count: number;
  users: Array<INewUser>;
}

export interface IBusinessMetadata {
  uuid: string;
  updatedAt: Date;
  companyType: string;
  deletedAt: null;
  companyName: string;
  tradingName: string;
  websiteUrl: string;
  otherContactInfo: string;
  natureOfBusiness: string;
  companyRegistrationNumber: string;
  isVatRegistered: string;
  vatNumber: string;
  isPubliclyTrading: boolean;
  stockMarketLocation: string;
  stockMarket: string;
  isRegulated: string;
  regulatorName: string;
  legalEntity: string;
  email: string;
  otherTradingNames: string;
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

interface IIndividualMetadata {
  title: string;
  firstname: string;
  lastname: string;
  formerName: string;
  otherName: string;
  dateOfBirth: string;
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

export interface IRiskAssessment {
  sanction: string;
  rating: string;
  apply: string;
  aml: string;
  sanctionedJurisdiction: string;
  highRiskJurisdiction: string;
  thirdParty: string;
  understood: string;
  materialConnection: string;
  sensitiveActivity: string;
  volume: string;
  transactions: string;
  knowledge: string;
  pep: string;
  adverseInformation: string;
  riskRating: string;
  completedBy: string;
  completionDate: Date;
  director: string;
  approvalDate: Date;
  notes: string;
  clientName: string;
  known: string;
  yearsKnown: string;
  metFace: string;
  numberOfBeneficialOwners: string;
  applicantForBusiness: string;
  classifyAsPep: string;
  automaticallyHigh: string;
  sanctionedCorporate: string;
  highRiskCorporate: string;
  highestRisk: string;
  publicOrWholly: string;
  bearer: string;
  ownershipInfo: string;
  clientEntityApply: string;
  considerWhere: string;
  principalAreaSanction: string;
  principalAreaRisk: string;
  principalAreaApply: string;
  businessPurpose: string;
  businessPurposeOptions: string;
  highRiskActivity: string;
  activityRegulated: string;
  valueOfEntity: string;
  nextRiskAssessment: string;

  completeDetail: string;
  completeNotesRationaleToJustify: string;
  completeAssessmentCompleteByName: string;
  completeWhereApplicableNameOfDirector: string;
  completeAnyNotesRegardingRiskAssessment: string;

  jurisdictionIsCompanyOwnershipDirectors: string;
  businessPurposeIfYesWhoItRegulatedBy: string;
  riskRatingAssessmentNotesReRationaleToJustify: string;

  raAttachDocumentUuid: string;
  raAttachDocument: IDocument;

  sourceOfFoundsAreFundsAssetsComingFromA3d2: string;
  sourceOfFoundsAreFundsAssetsComingFromA3d2Details: string;
  residenceNationalityResidenceOfBeneficial: string;

  riskRatingAssessmentCompleted: string;
}

interface IBankMetadata {
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

export interface IPayloadRiskAssessment {
  clientUuid: string;

  sanction: string;
  rating: string;
  apply: string;
  aml: string;
  sanctionedJurisdiction: string;
  highRiskJurisdiction: string;
  thirdParty: string;
  understood: string;
  materialConnection: string;
  sensitiveActivity: string;
  volume: string;
  transactions: string;
  knowledge: string;
  pep: string;
  adverseInformation: string;
  riskRating: string;
  completedBy: string;
  completionDate: Date;
  director: string;
  approvalDate: Date;
  notes: string;
  clientName: string;
  known: string;
  yearsKnown: string;
  metFace: string;
  numberOfBeneficialOwners: string;
  applicantForBusiness: string;
  classifyAsPep: string;
  automaticallyHigh: string;
  sanctionedCorporate: string;
  highRiskCorporate: string;
  highestRisk: string;
  publicOrWholly: string;
  bearer: string;
  ownershipInfo: string;
  clientEntityApply: string;
  considerWhere: string;
  principalAreaSanction: string;
  principalAreaRisk: string;
  principalAreaApply: string;
  businessPurpose: string;
  businessPurposeOptions: string;
  highRiskActivity: string;
  activityRegulated: string;
  valueOfEntity: string;

  businessPurposeIfYesWhoItRegulatedBy: string;

  residenceNationalityResidenceOfBeneficial: string;

  sourceOfFoundsAreFundsAssetsComingFromA3d2: string;
  sourceOfFoundsAreFundsAssetsComingFromA3d2Details: string;

  riskRatingAssessmentCompleted: string;

  completeDetail: string;
  completeNotesRationaleToJustify: string;
  completeAssessmentCompleteByName: string;
  completeAnyNotesRegardingRiskAssessment: string;

  jurisdictionIsCompanyOwnershipDirectors: string;

  riskRatingAssessmentNotesReRationaleToJustify: string;

  raAttachDocumentUuid: string;
  raAttachDocument: {
    createdAt: Date | null;
    creator: string;
    deletedAt: Date | null;
    originalFilename: string;
    ownCloudPath: string;
    updatedAt: Date | null;
    uuid: string;
  };
}

interface INewUser {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  firstname: string;
  lastname: string;
  hasAcceptedTerms: boolean;
  isMobile2FAEnabled: boolean;
  passwordUpdatedAt: Date;
  contact: {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    country: string;
    mobileNumber: string;
    isApproved: boolean;
    isSubAccount: boolean;
  };
  userClients: Array<string>;
  profileImage: string;
  role: string;
}

export interface IDirector {
  uuid: string;
  fullName: string;
  dob: string;
  occupation: string;
  telephoneNumber: string;
  email: string;
  nationality: string;
  address1: string;
  address2: string;
  previousAddress1: string;
  previousAddress2: string;
  country: string;
}

interface IShareholder {
  uuid: string;
  fullName: string;
  dob: string;
  occupation: string;
  telephoneNumber: string;
  email: string;
  nationality: string;
  entityType: string;
  companyType: string;
  address1: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  address2: string;
  previousAddress1: string;
  previousAddress2: string;
  country: string;
  shares: string;
  individualMetadata?: IIndividualMetadata;
  businessMetadata?: IBusinessMetadata;
}

export interface IBroker {
  uuid: string;
  name: string;
  address: string;
  kyc: string;
  client: string;
  percentageSplit: string;
  payment: string;
  bankAccount: string;
  contract: string;
  comment: string;
  country: string;
}

export interface IPostShareholder {
  clientId: string;
  masterClientId: string;
  shareholders: Array<
    | IShareholder
    | {
        address1: string;
        address2: string;
        country: string;
        dob?: string;
        email: string;
        entityType: 'individual' | 'business';
        fullName: string;
        nationality?: string;
        occupation?: string;
        previousAddress1: string;
        previousAddress2: string;
        shares: string;
        state: string;
        telephoneNumber: string;
        companyType?: string;
      }
  >;
}

export interface IDeleteShareholderPayload {
  masterClientId: string;
  clientId: string;
  shareholders: Array<IShareholder>;
}

export interface IPayloadChangePassword {
  uuid: string;
  newPassword: string;
  confirmPassword: string;
}

export type IApprovelMetadataSession = 'personal' | 'address' | 'employment';

export interface IPayloadGetApprovalMetadata {
  uuid: string;
  session: IApprovelMetadataSession;
}

export interface IPayloadApproveMetadata {
  clientId: string;
  tempId: string;
}

export interface IPayloadRejectMetadata {
  clientId: string;
  tempId: string;
  reason: string;
}

export interface IGetApprovalMetadataResponse {
  session: string;
  clientId: string;
  individualMetadata?: {
    city: string;
    uuid: string;
    email: string;
    state: string;
    title: string;
    gender: string;
    country: string;
    lastname: string;
    mobileNumber: string;
    postcode: string;
    createdAt: string;
    firstname: string;
    updatedAt: string;
    formerName: string;
    occupation: string;
    dateOfBirth: string;
    addressLine1: string;
    addressLine2: string;
    employerName: string;
    placeOfBirth: string;
    employerAddress1: string;
    employerAddress2: string;
    employerAddress3: string;
    identificationType: string;
    identificationNumber: string;

    previousAddressLine1: string;
    previousAddressLine2: string;
    previousCity: string;
    previousPostcode: string;
    previousState: string;
    previousCountry: string;
  };
  businessMetadata?: {
    city: string;
    email: string;
    state: string;
    country: string;
    postcode: string;
    addressLine1: string;
    addressLine2: string;
    mailingAddress: string;
    registeredOffice1: string;
    registeredOffice2: string;
    principalPlaceOfBusiness: string;
    previousOffice1: string;
    previousOffice2: string;
    previousOffice3: string;
  };
  userClientsMetadataDto?: {
    whoTheyAre: string;
    phoneNumber: string;
  };
  id: string;
}

export interface IPayloadSendWelcomeEmail {
  uuid: string;
}
