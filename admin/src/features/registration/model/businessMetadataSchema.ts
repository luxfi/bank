import * as yup from "yup";
import { companyTypes } from "../../beneficiaries/model/entity-types";
import { countries } from "./countries";

export const businessMetadataSchema = yup.object({
  companyName: yup.string().required(),
  tradingName: yup.string(),
  websiteUrl: yup.string().required(),
  natureOfBusiness: yup.string(),
  companyRegistrationNumber: yup.string().required(),
  companyType: yup.string().optional().oneOf(Array.from(companyTypes.keys())),
  isVatRegistered: yup.boolean() || true,
  vatNumber: yup.string().when("isVatRegistered", {
    is: true,
    then: yup.string().required(),
  }),

  isPubliclyTrading: yup.boolean().required(),
  stockMarketLocation: yup.string().when("isPubliclyTrading", {
    is: true,
    then: yup.string().oneOf(Array.from(countries.keys())),
  }),
  stockMarket: yup.string().when("isPubliclyTrading", {
    is: true,
    then: yup.string().required(),
  }),

  isRegulated: yup.boolean().required(),
  regulatorName: yup.string().when("isRegulated", {
    is: true,
    then: yup.string().required(),
  }),
  legalEntity: yup.string(),
  email: yup.string(),
  otherTradingNames: yup.string(),
  countryOfRegistration: yup.string(),
  dateOfRegistration: yup.string(),
  telephoneNumber: yup.string(),
  dateOfIncorporation: yup.string(),
  statutoryProvision: yup.string(),
  registeredOffice1: yup.string(),
  registeredOffice1_address2: yup.string(),
  registeredOffice1_city: yup.string(),
  registeredOffice1_postcode: yup.string(),
  registeredOffice1_state: yup.string(),
  registeredOffice2: yup.string(),
  registeredOffice3: yup.string(),
  principalPlace: yup.string(),
  mailingAddress: yup.string(),
  previousOffice1: yup.string(),
  previousOffice2: yup.string(),
  previousOffice3: yup.string(),
  expectedActivity: yup.string(),
  expectedVolume: yup.string(),
  otherContactInfo: yup.string(),
});

export type BusinessMetadataDto = yup.TypeOf<typeof businessMetadataSchema>;
