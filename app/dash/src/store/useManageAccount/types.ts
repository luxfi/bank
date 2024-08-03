import { IDefaultStates } from '../helpers/setStates';

export type TState = IDefaultStates<TActions> & {
  isLoading: boolean;
};

export type TActions = {
  updateIndividualPersonalDetails: (
    payload: IPayloadUpdateIndividualPersonalDetails
  ) => Promise<void>;
  updateIndividualAddress: (
    payload: IPayloadUpdateIndividualAddress
  ) => Promise<void>;
  updateIndividualEmploymentDetails: (
    payload: IPayloadUpdateIndividualEmploymentDetails
  ) => Promise<void>;
  updateBusinessAddress: (
    payload: IPayloadUpdateBusinessAddress
  ) => Promise<void>;
  updateBusinessDetailsOfRegistrar: (
    payload: IPayloadUpdateBusinessDetailsOfRegistrar
  ) => Promise<void>;
};

export const PATHS = {
  UPDATE_INDIVIDUAL_PERSONAL_DETAILS: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/metadata/temp`,
  UPDATE_INDIVIDUAL_EMPLOYMENT_DETAILS: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/metadata/temp`,
  UPDATE_INDIVIDUAL_ADDRESS: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/metadata/temp`,
  UPDATE_BUSINESS_ADDRESS: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/metadata/temp`,
  UPDATE_BUSINESS_DETAILS_OF_REGISTRAR: (uuid: string) =>
    `/api/v1/admin/clients/${uuid}/metadata/temp`,
};

export interface IPayloadUpdateIndividualPersonalDetails {
  uuid: string;
  clientId: string;
  session: 'personal';
  individualMetadata: {
    title: string;
    firstname: string;
    lastname: string;
    email: string;
    mobileNumber: string;
  };
}

export interface IPayloadUpdateIndividualAddress {
  uuid: string;
  clientId: string;
  session: 'address';
  individualMetadata: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    country: string;
    postcode: string;
    state: string;

    previousAddressLine1: string;
    previousAddressLine2: string;
    previousCity: string;
    previousCountry: string;
    previousPostcode: string;
    previousState: string;
  };
}

export interface IPayloadUpdateIndividualEmploymentDetails {
  uuid: string;
  clientId: string;
  session: 'employment';
  individualMetadata: {
    employerAddress1: string;
    employerAddress2: string;
    employerAddress3: string;
    employerName: string;
    occupation: string;
  };
}

export interface IPayloadUpdateBusinessAddress {
  uuid: string;
  clientId: string;
  session: 'address';
  businessMetadata: {
    addressLine1: string;
    addressLine2: string;
    postcode: string;
    city: string;
    state: string;
    country: string;
    registeredOffice1: string;
    registeredOffice2: string;
    principalPlaceOfBusiness: string;
    mailingAddress: string;
    previousOffice1: string;
    previousOffice2: string;
    previousOffice3: string;
  };
}

export interface IPayloadUpdateBusinessDetailsOfRegistrar {
  uuid: string;
  clientId: string;
  session: 'personal';
  userClientsMetadataDto: {
    whoTheyAre: string;
    phoneNumber: string;
  };
}
