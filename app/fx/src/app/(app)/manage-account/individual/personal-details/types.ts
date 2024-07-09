import * as Yup from 'yup';

export interface IPersonDetail {
  title: string;
  fullName: string;
  formerName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  gender: string;
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
  firstName: Yup.string().required('Enter your first name'),
  lastName: Yup.string().required('Enter your last name'),
  email: Yup.string().required('Enter your email'),
  phoneNumber: Yup.string().required('Enter your phone number'),
});
