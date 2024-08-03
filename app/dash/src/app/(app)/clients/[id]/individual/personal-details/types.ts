import * as Yup from 'yup';

export interface IPersonDetail {
  title: string;
  fullName: string;
  formerName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  emailVerify: string;
  country: string;
  placeOfBirth: string;
  nationality: string;
  gender: string;
  otherNames: string;
}

export interface IPersonDetailsEdit {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export const validationForm = Yup.object({
  title: Yup.string().required('Enter title'),
  fullName: Yup.string().required('Enter your name'),
});
