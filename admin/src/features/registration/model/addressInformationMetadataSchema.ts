import * as yup from 'yup'
import { countries } from './countries'
export const addressInformationMetadataSchema  = yup.object({
  line11: yup.string().required("Please enter the Address Line 1"),
  line12: yup.string(),
  line21: yup.string(),
  line22: yup.string(),
  city1: yup.string().required("Please enter the City"),
  city2: yup.string(),
  codePost1: yup.string().required("Please enter the Zip code/Post code"),
  codePost2: yup.string(),
  state1: yup.string().required("Please enter the State/County"),
  state2: yup.string(),
  country1: yup.string().oneOf(Array.from(countries.keys())).required('Please select a country'),
  country2: yup.string().oneOf(Array.from(countries.keys())),
});
export type AddressInformationMetadataDto = yup.TypeOf<typeof addressInformationMetadataSchema>;

