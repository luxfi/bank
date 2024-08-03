import * as Yup from 'yup';

export interface IAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;

  previousAddressLine1: string;
  previousAddressLine2: string;
  previousCity: string;
  previousPostcode: string;
  previousCountry: string;
  previousState: string;
}

export const validationForm = Yup.object({
  addressLine1: Yup.string().required('Enter your address line 1'),
  addressLine2: Yup.string(),
  city: Yup.string().required('Enter your city'),
  postcode: Yup.string().required('Enter your postcode'),
  country: Yup.string().required('Enter your country'),
  state: Yup.string().required('Enter your state'),

  previousAddressLine1: Yup.string(),
  previousAddressLine2: Yup.string(),
  previousCity: Yup.string(),
  previousPostcode: Yup.string(),
  previousCountry: Yup.string(),
  previousState: Yup.string(),
});
