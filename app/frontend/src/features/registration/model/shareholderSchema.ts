import * as yup from "yup";
import { BusinessMetadataDto } from "./businessMetadataSchema";
import { IndividualMetadataDto } from "./individualMetadataSchema";
import moment from 'moment';
export const shareholderTypes: Map<string, string> = new Map(
  Object.entries({
    business: "Business",
    individual: "Individual",
  })
);

export const shareholderCompanyTypes: Map<string, string> = new Map(
  Object.entries({
    LIMITED_LIABILITY: "Limited Liability",
    SOLE_TRADER: "Sole trader",
    PARTNERSHIP: "Partnership",
    CHARITY: "Charity",
    JOINT_STOCK_COMPANY: "Joint Stock Company",
    PUBLIC_LIMITED_COMPANY: "Public Limited Company",
  })
);

export const shareholderSchema = yup.object({
  uuid: yup.string(),
  fullName: yup.string(),
  dob: yup.date().required("Please enter Date of Birth").max(moment(new Date()).subtract(18, 'y').toDate(), "Shareholder must be at least 18 years old"),
  occupation: yup.string(),
  telephoneNumber: yup.string(),
  email: yup.string(),
  nationality: yup.string(),
  address1: yup.string(),
  address2: yup.string(),
  previousAddress1: yup.string(),
  previousAddress2: yup.string(),
  country: yup.string(),
  shares: yup.number(),
  entityType: yup
    .string()
    .required()
    .oneOf(Array.from(shareholderTypes.keys())),
  companyType: yup
    .string()
    .optional()
    .oneOf(Array.from(shareholderCompanyTypes.keys())),
    createdAt: yup.string() || undefined,
    updatedAt:yup.string() || undefined,
});

export type ShareholderDto = yup.TypeOf<typeof shareholderSchema> & {
  entityType: string;
  businessMetadata?: BusinessMetadataDto;
  individualMetadata?: IndividualMetadataDto;
  
};
