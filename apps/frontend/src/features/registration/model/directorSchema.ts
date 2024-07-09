import * as yup from "yup";
import moment from 'moment';
export const directorSchema = yup.object({
  uuid: yup.string(),
  fullName: yup.string(),
  dob: yup.date().required("Please enter Date of Birth").max(moment(new Date()).subtract(18, 'y').toDate(), "Director must be at least 18 years olds"),
  occupation: yup.string(),
  telephoneNumber: yup.string(),
  email: yup.string(),
  nationality: yup.string(),
  address1: yup.string(),
  address2: yup.string(),
  previousAddress1: yup.string(),
  previousAddress2: yup.string(),
  country: yup.string(),
  createdAt: yup.string() || undefined,
  updatedAt:yup.string() || undefined,
});

export type DirectorDto = yup.TypeOf<typeof directorSchema>;
