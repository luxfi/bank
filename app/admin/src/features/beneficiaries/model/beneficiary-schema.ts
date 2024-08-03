import * as yup from "yup";
import { isIBAN, isInUk, isSwift } from "../../../utils/country-check";
import { countries } from "../../registration/model/countries";
import { currencies } from "./currencies";
import { entityTypes } from "./entity-types";

export const beneficiarySchema = yup.object({
  firstname: yup.string().when("entityType", {
    is: "individual",
    then: yup.string().required("Please enter the First name"),
  }),
  lastname: yup.string().when("entityType", {
    is: "individual",
    then: yup.string().required("Please enter the Last name"),
  }),
  entityType: yup.string().required().oneOf(Array.from(entityTypes.keys())),
  currency: yup.string().required('Please select a currency').oneOf(Array.from(currencies.keys())),
  address: yup
    .string()
    .when("entityType", {
      is: "individual",
      then: yup.string().required("Please enter the Address"),
    })
    .required("Please enter the Address"),
  city: yup.string().required("Please enter the City"),
  state: yup.string().required("Please enter the State/County"),
  postcode: yup.string().required("Please enter the Zip code/Post code"),
  country: yup.string().required().oneOf(Array.from(countries.keys())),
  companyName: yup.string().when("entityType", {
    is: "business",
    then: yup.string().required("Please enter the Company Name"),
  }),
  bankCountry: yup.string().required('Please select a Bank Country').oneOf(Array.from(countries.keys())),
  accountNumber: yup
    .string()
    .when("bankCountry", {
      is: (bankCountry: string, accountNumber: string, sortCode: string) =>
        isInUk(bankCountry),
      then: yup
        .string()
        .matches(/^[0-9]{8}$/, "Account number needs to be 8 digits."),
    })
    .test(
      "bank-details-required",
      "Please enter the account number and sort code or IBAN and BIC SWIFT.",
      function (val) {
        const obj = this.parent;
        if (!isInUk(obj.bankCountry)) {
          return true;
        }

        return (
          (obj.accountNumber && obj.sortCode) || (obj.IBAN && obj.bicSwift)
        );
      }
    ),
  sortCode: yup.string().when(["bankCountry", "currency"],{
    is: (bankCountry:string, currency:string) => isInUk(bankCountry) && currency == 'GBP',
    then: yup.string().matches(/^[0-9]{6}$/, "Sort code needs to be 6 digits."),
  }),
  IBAN: yup
    .string()
    .when(["bankCountry", "accountNumber", "sortCode", "currency"], {
      // eslint-disable-next-line no-mixed-operators
      is: (
        bankCountry: string,
        accountNumber: string,
        sortCode: string,
        currency: string
      ) =>
        isIBAN(bankCountry) ||
        (isInUk(bankCountry) && accountNumber === "" && sortCode === "") ||
        (isInUk(bankCountry) && currency !== "GBP"),
      then: yup
        .string()
        .matches(/^([A-Z0-9]\s*){15,34}$/, "Please enter a valid IBAN."),
      // .required(),
    }),
  bicSwift: yup
    .string()
    .when(['bankCountry', 'accountNumber', 'sortCode', 'currency'], {
      is: (
        bankCountry: string,
        accountNumber: string,
        sortCode: string,
        currency: string
      ) =>
        isSwift(bankCountry) ||
        (isInUk(bankCountry) && accountNumber === "" && sortCode === "") ||
        (isInUk(bankCountry) && currency !== "GBP"),
      then: yup
        .string()
        .matches(
          /^[0-9A-Z]{8}$|^[0-9A-Z]{11}$/,
          "Please enter a valid BIC SWIFT."
        ).required('Please enter a valid BIC SWIFT.'),
      otherwise: yup.string().nullable(true).optional()
    }),
});

export const currencyBeneficiarySchema = yup.object({
  id: yup.string(),
  bank_account_holder_name: yup.string(),
  name: yup.string(),
  email: yup.string(),
  payment_types: yup.array(),
  beneficiary_address: yup.string(),
  beneficiary_country: yup.string(),
  beneficiary_entity_type: yup.string(),
  beneficiary_company_name: yup.string(),
  beneficiary_first_name: yup.string(),
  beneficiary_last_name: yup.string(),
  beneficiary_city: yup.string(),
  beneficiary_postcode: yup.string(),
  beneficiary_state_or_province: yup.string(),
  beneficiary_date_of_birth: yup.string(),
  beneficiary_identification_type: yup.string(),
  beneficiary_identification_value: yup.string(),
  bank_country: yup.string(),
  bank_name: yup.string(),
  bank_account_type: yup.string(),
  currency: yup.string(),
  account_number: yup.string(),
  routing_code_type_1: yup.string(),
  routing_code_value_1: yup.string(),
  routing_code_type_2: yup.string(),
  routing_code_value_2: yup.string(),
  bic_swift: yup.string(),
  iban: yup.string(),
  default_beneficiary: yup.string(),
  creator_contact_id: yup.string(),
  bank_address: yup.string(),
  beneficiary_external_reference: yup.string(),
});
