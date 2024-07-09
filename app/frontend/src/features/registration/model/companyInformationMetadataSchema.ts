import * as yup from 'yup'
export const companyInformationMetadataSchema  = yup.object({
  company_name: yup.string().required('Please enter the Company Name'),
  trading_name: yup.string().required('Please enter the Trading Name'),
  website_url: yup.string().required('Please enter the Website URL'),
  nature_of_business: yup.string().required('Please enter the Nature of Business'),
  company_registration_number: yup.string().required('Please enter the Registration Number'),
  is_vat_registered: yup.string(),
  vat_number: yup.string(),
  is_public_trading: yup.string(),
  stock_market_location: yup.string(),
  stock_market: yup.string(),
  is_regulated: yup.string(),
  regulator_name: yup.string(),
  address1: yup.string().required('Please enter the Address Line 1'),
  address2: yup.string(),
  city: yup.string().required('Please enter the City'),
  state: yup.string().required('Please enter the State/County'),
  postcode: yup.string().required('Please enter the Zip code/Post code'),
})
export type CompanyInformationMetadataDto = yup.TypeOf<typeof companyInformationMetadataSchema>;