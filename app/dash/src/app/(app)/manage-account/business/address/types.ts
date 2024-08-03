import * as Yup from 'yup';

export interface IAddress {
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
}

export const validationForm = Yup.object({
  addressLine1: Yup.string().required('Enter your address'),
  addressLine2: Yup.string().nullable(),
  city: Yup.string().required('Enter your city'),
  country: Yup.string().required('Enter your country'),
  postcode: Yup.string().required('Enter your postcode'),
  state: Yup.string().required('Enter your state'),
  mailingAddress: Yup.string()
    .required('Enter your mailing address')
    .email('Enter a valid email'),
  principalPlaceOfBusiness: Yup.string().required('Enter your principal place'),
  registeredOffice1: Yup.string().nullable(),
  registeredOffice2: Yup.string().nullable(),
  previousOffice1: Yup.string().nullable(),
  previousOffice2: Yup.string().nullable(),
  previousOffice3: Yup.string().nullable(),
});
