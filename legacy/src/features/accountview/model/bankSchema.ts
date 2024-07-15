import * as yup from "yup";
import { countries } from "../../registration/model/countries";

export const bankSchema = yup.object({
  bank_regular_payment: yup.string().required(),
  bank_iban: yup.string()
        .matches(/^([A-Z0-9]\s*){15,34}$/, "Please enter a valid IBAN."),
  bank_address: yup.string(),
  bank_city: yup.string(),
  bank_country: yup.string().required().oneOf(Array.from(countries.keys())),
  bank_priority_payment: yup.string().required()
});

export type BeneficiaryDetailsMetadtaDto = yup.TypeOf<typeof bankSchema>;

