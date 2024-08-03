import * as Yup from 'yup';

export interface IAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  postcode: string;
  state: string;
  mailingAddress: string;
  principalPlaceOfBusiness: string;
  registeredOffice1: string;
  registeredOffice2: string;

  previousOffice1: string;
  previousOffice2: string;
  previousOffice3: string;
}

export const validationForm = Yup.object({
  addressLine1: Yup.string().required('Enter your address'),
  addressLine2: Yup.string(),
  city: Yup.string().required('Enter your city'),
  country: Yup.string().required('Enter your country'),
  postcode: Yup.string().required('Enter your postcode'),
  state: Yup.string().required('Enter your state'),
  mailingAddress: Yup.string(),
  principalPlaceOfBusiness: Yup.string(),
  registeredOffice1: Yup.string(),
  registeredOffice2: Yup.string(),

  previousOffice1: Yup.string(),
  previousOffice2: Yup.string(),
  previousOffice3: Yup.string(),
});
