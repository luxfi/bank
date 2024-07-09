import * as yup from "yup";
import { isInUk, isSwift } from "../../../utils/country-check";
import { currencies } from "../../beneficiaries/model/currencies";
import { countries } from "./countries";
export const bankMetadataSchema = yup.object({
  sort1: yup.string(),
  sort2: yup.string(),
  sort3: yup.string(),
  bankName: yup.string().required('Please enter the bank name'),
  branch: yup.string().required('Please enter the branch name'),
  bankCountry: yup.string().required('Please select a Bank Country').oneOf(Array.from(countries.keys())),
  accountHolderName: yup.string().required('Please enter the account holder name'),
  currency: yup.string().required('Please select a Currency').oneOf(Array.from(currencies.keys())),
  sortCode: yup
    .string()
    .matches(/^[0-9]{3}$/, "Sort code needs to be 6 digits."),
  accountNumber: yup
    .string()
    .matches(/^[0-9]{8}$/, "Account number needs to be 8 digits."),
  IBAN: yup
    .string()
    .matches(/^([A-Z0-9]\s*){15,34}$/, "Please enter a valid IBAN."),
  bicSwift: yup
    .string()
    .when(["bankCountry", "accountNumber", "sortCode", "currency"], {
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
        ).required('Please enter a valid BIC SWIFT'),
    }),
});
export type BankMetadataDto = yup.TypeOf<typeof bankMetadataSchema>;
