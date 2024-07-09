import * as yup from "yup";
import { companyTypes } from "../../beneficiaries/model/entity-types";
import { businessRoles } from "./businessRoles";
import { countries } from "./countries";

export const countrySlideSchema = yup.object({
  country: yup.string().oneOf(Array.from(countries.keys())).required('Please select a country'),
  businessRoleSelect: yup.string().oneOf(Array.from(businessRoles.keys())),
  companyType: yup.string().optional().oneOf(Array.from(companyTypes.keys())),
  businessRole: yup.string().when("businessRoleSelect", {
    is: "other",
    then: yup
      .string()
      .required("Please specify your role in the organization."),
  }),
});

export type CountrySlideDto = yup.TypeOf<typeof countrySlideSchema>;
