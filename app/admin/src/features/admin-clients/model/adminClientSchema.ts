import * as yup from "yup";
import { yesOrNo } from "../../../utils/select-options";
import { initialContactValues } from "../../accounts/model/account-initial-value";
import { contactSchema } from "../../accounts/model/account-schema";
import {
  companyTypes,
  entityTypes,
} from "../../beneficiaries/model/entity-types";
import { businessRoles } from "../../registration/model/businessRoles";
import { countries } from "../../registration/model/countries";
import { PASSWORD_REQUIREMENTS_TEXT } from "../../registration/model/passwordSchema";
export const adminClientSchema = yup.object({
  firstname: yup.string().required("Please enter the First name"),
  lastname: yup.string().required("Please enter the Last name"),
  email: yup.string().required("Please enter the Email"),
  entityType: yup.string().oneOf(Array.from(entityTypes.keys())),
  companyType: yup.string().optional().oneOf(Array.from(companyTypes.keys())),
  country: yup.string().oneOf(Array.from(countries.keys())),
  mobileNumber: yup.string().phone().required(),
  businessRoleSelect: yup.string().oneOf(Array.from(businessRoles.keys())),
  businessRole: yup.string().when("businessRoleSelect", {
    is: "other",
    then: yup
      .string()
      .required("Please specify your role in the organization."),
  }),
  // password: yup
  //   .string()
  //   .matches(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])(?=.{8,})/,
  //     PASSWORD_REQUIREMENTS_TEXT
  //   )
  //   .required(),

  password: yup.string().when("id", {
    is: (id: string) => !!id,
    then: yup.string().notRequired(),
    otherwise: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])(?=.{8,})/,
        PASSWORD_REQUIREMENTS_TEXT
      )
      .required(),
  }),
  confirmPassword: yup
    .string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
  verifiedAt: yup.string().oneOf(Array.from(yesOrNo.keys())),
  cloudCurrencyId: yup.string(),
  contact: contactSchema.optional().nullable(true),
  skipWelcomeEmail: yup.string(),
  complyLaunchId: yup.string(),
});

export type AdminClientDto = yup.TypeOf<typeof adminClientSchema>;
export const initialAdminClientData: AdminClientDto = {
  firstname: "",
  lastname: "",
  email: "",
  entityType: "individual",
  country: "IM",
  mobileNumber: "",
  businessRoleSelect: "Board director / Business owner",
  businessRole: "",
  password: "",
  confirmPassword: "",
  verifiedAt: "",
  cloudCurrencyId: "",
  companyType: "LIMITED_LIABILITY",
  skipWelcomeEmail: "yes",
  complyLaunchId: "",
  contact: null,
};
