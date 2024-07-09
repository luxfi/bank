import * as yup from "yup";
import { countries } from "./countries";
import { genders } from "./genders";
import { identificationTypes } from "./identificationTypes";
import { personalTitles } from "./personalTitles";
import moment from 'moment';
export const individualMetadataSchema = yup.object({
  title: yup.string().oneOf(Array.from(personalTitles.keys())),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  formerName: yup.string(),
  otherName: yup.string(),
  dateOfBirth: yup.date().required("Please enter your Date of birth").max(moment(new Date()).subtract(18, 'y').toDate(), "You must be at least 18 years old to register"),
  placeOfBirth: yup.string().required(),
  addressLine1: yup.string().required(),
  addressLine2: yup.string(),
  city: yup.string().required(),
  state: yup.string().required(),
  postcode: yup.string().required(),
  country: yup.string().oneOf(Array.from(countries.keys())),
  skipPreviousAddress: yup.boolean().required(),
  previousAddressLine1: yup.string(),
  previousAddressLine2: yup.string(),
  previousCity: yup.string(),
  previousPostcode: yup.string(),
  previousState: yup.string(),
  previousCountry: yup.string().oneOf(Array.from(countries.keys())).optional(),
  nationality: yup.string().oneOf(Array.from(countries.keys())),
  gender: yup.string().oneOf(Array.from(genders.keys())),
  identificationNumber: yup.string().required(),
  identificationType: yup
    .string()
    .oneOf(Array.from(identificationTypes.keys())),
  occupation: yup.string().required(),
  employerName: yup.string(),
  employerAddress1: yup.string(),
  employerAddress2: yup.string(),
  employerAddress3: yup.string(),
  publicPosition: yup.string(),
  highProfilePosition: yup.string(),
});

export type IndividualMetadataDto = yup.TypeOf<typeof individualMetadataSchema>;
