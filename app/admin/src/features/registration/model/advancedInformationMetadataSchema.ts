import * as yup from 'yup'
import { personalTitles } from "./personalTitles";
import moment from 'moment';
export const advancedInformationMetadataSchema  = yup.object({
  title: yup.string().oneOf(Array.from(personalTitles.keys())),
  firstname: yup.string().required("Please enter your First name"),
  lastname: yup.string().required("Please enter your Last name"),
  formername: yup.string(),
  otherName: yup.string(),
  birth: yup.date().required("Please enter your Date of birth").max(moment(new Date()).subtract(18, 'y').toDate(), "You must be at least 18 years old to register"),
  place: yup.string().required("Please enter your Place of birth"),
});
export type AdvancedInformationMetadataDto = yup.TypeOf<typeof advancedInformationMetadataSchema>;
