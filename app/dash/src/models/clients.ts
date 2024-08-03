export interface IClients {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  username: string;
  firstname: string;
  lastname: string;
  hasAcceptedTerms: boolean;
  archivedAt?: string;
  invitedBy?: string;
  verificationCode?: string;
  verifiedAt?: string;
  role?: string;
  twoFASecret?: string;
  twoFA?: string;
  clients?: Array<IUserClient>;
  isMobile2FAEnabled: boolean;
  contact: IClientContact;
}

export interface ISubAccount {
  accountHolderId: string;
  clientType: string;
  friendlyName: string;
  taken: boolean;
}

export interface IUserClient {
  uuid: string;
  createdAt: string;
  deletedAt: string;
  name: string;
  updatedAt: string;
  account: IClientAccount;
  users: Array<IClients>;
  client?: string;
}

export interface IClientDirectors {
  uuid: string;
  createdAt: string;
  updatedAt: string;
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
  account: IClientAccount;
}

export interface IShareholder {
  uuid: string;
  entityType: string;
  fullName: string;
  dob: string;
  telephoneNumber: string;
  companyType: string;
  email: string;
  nationality: string;
  shares: string;
  addressLine1: string;
  addressLine2: string;
  previousAddress1: string;
  previousAddress2: string;
  state: string;
  country: string;
}

export interface IBrokers {
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
}

export interface IClientUser {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  username: string;
  firstname: string;
  lastname: string;
  hasAcceptedTerms: boolean;
  archivedAt?: string;
  invitedBy: string;
  verificationCode: string;
  verifiedAt?: string;
  role: string;
  twoFASecret?: string;
  twoFA?: string;
  isMobile2FAEnabled?: boolean;
  documents: Array<any>;
}

export interface IBankMetadata {
  bankName: string;
  branch: string;
  bankCountry: string;
  accountHolderName: string;
  sortCode: string;
  accountNumber: string;
  IBAN: string;
  bicSwift: string;
  currency: string;
  sort1: string;
  uuid: string;
}

export interface IClientContact {
  uuid: string;
  user: IClientUser;
  createdAt: string;
  updatedAt: string;
  businessRole: string;
  country: string;
  mobileNumber: string;
  isApproved: boolean;
  isSubAccount: boolean;
  account: IClientAccount;
  deletedAt?: string;
  cloudCurrencyId?: string;
  openPaydId?: string;
  expectedVolumeOfTransactions?: string;
  expectedValueOfTurnover?: string;
  complyLaunchId?: string;
  complyLaunchResponse?: string;
  currencyCloudPasswordUrl?: string;
  bankMetadata?: IBankMetadata;
  individualMetadata?: IIndividualMetadata;
  invitation?: string;
}

export interface IIndividualMetadata {
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
  emailVerified: string;
  previousAddressLine1: string;
  previousAddressLine2: string;
  previousCity: string;
  previousPostcode: string;
  previousCountry: string;
  previousState: string;
  nationality: string;
  gender: string;
  email: string;
  identificationNumber: string;
  identificationType: string;
  occupation: string;
  employerName: string;
  employerAddress1: string;
  employerAddress2: string;
  employerAddress3: string;
  publicPosition: string;
  highProfilePosition: string;
  deletedAt?: Date;
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
  completionDate: string;
  director: string;
  approvalDate: string;
  notes: string;
  clientName: string;
  known: string;
  yearsKnown: string;
  metFace: string;
  numberOfBeneficialOwners: string;
  nextRiskAssessment: string;
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
}

export interface IClientAccount {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  entityType: string;
  businessMetadata: IClientBusiness;
  riskAssessments: Array<IRiskAssessment>;
  contact: Array<IClientContact>;
  brokers: Array<IBrokers>;
  directors: Array<IClientDirectors>;
  shareholders: Array<IShareholder>;
  isApproved: false;
  pendingMetadatas: Array<any>;
  deletedAt?: string;
  bankMetadata?: IBankMetadata;
  individualMetadata?: IIndividualMetadata;
  cloudCurrencyId?: string;
  openPaydId?: string;
  archivedAt?: string;
  gatewayId?: string;
  gateway?: string;
  fee?: string;
}

export interface IClientBusiness {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  companyType: string;
  countryOfRegistration: string;
  telephoneNumber: string;
  deletedAt?: string;
  companyName?: string;
  tradingName?: string;
  websiteUrl?: string;
  otherContactInfo?: string;
  natureOfBusiness?: string;
  companyRegistrationNumber?: string;
  isVatRegistered?: string;
  vatNumber?: string;
  isPubliclyTrading?: string;
  stockMarketLocation?: string;
  stockMarket?: string;
  isRegulated?: string;
  regulatorName?: string;
  legalEntity?: string;
  otherTradingNames?: string;
  dateOfRegistration?: string;
  dateOfIncorporation?: string;
  statutoryProvision?: string;
  registeredOffice1?: string;
  registeredOffice1_address2?: string;
  registeredOffice1_postcode?: string;
  registeredOffice1_city?: string;
  registeredOffice1_state?: string;
  registeredOffice2?: string;
  registeredOffice3?: string;
  principalPlace?: string;
  mailingAddress?: string;
  address1?: string;
  address2?: string;
  previousOffice1?: string;
  previousOffice2?: string;
  previousOffice3?: string;
  expectedActivity?: string;
  expectedVolume?: string;
}

export interface IDtoClientsPost {
  contact: IClientContact;
  firstname: string;
  lastname: string;
  email: string;
  cloudCurrencyId?: string;
  entityType?: string;
  country: string;
  mobileNumber: string;
  businessRoleSelect: string;
  businessRole: string;
  password: string;
  confirmPassword: string;
  verifiedAt: string;
  skipWelcomeEmail: string;
  complyLaunchId?: string;
}

export interface INewClient {
  firstname: string;
  lastname: string;
  email: string;
  entityType: string;
  country: string;
  mobileNumber: string;
  businessRoleSelect: string;
  businessRole: string;
  password: string;
  confirmPassword: string;
  verifiedAt: string;
  cloudCurrencyId: string;
  companyType: string;

  complyLaunchId: string;
  contact?: string | null;
  companyName?: string | null;
}
