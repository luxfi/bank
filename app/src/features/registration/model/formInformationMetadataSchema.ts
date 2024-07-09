import * as yup from 'yup'
import { identificationTypes } from "./identificationTypes";
export const formInformationMetadataSchema  = yup.object({
  gender: yup.string().required(),
  identificationType: yup
  .string()
  .oneOf(Array.from(identificationTypes.keys())),
  identifyNumber: yup.string().required("Please enter your ID number"),
  occupation: yup.string().required("Please enter your Occupation"),
  employerName: yup.string().required("Please enter your Employer Name"),
  employerAddress1: yup.string().required("Please enter your Employer Address"),
  nationality: yup.string().required("Please select your Nationality"),
})
export type formInformationMetadataDto = yup.TypeOf<typeof formInformationMetadataSchema>;
