import * as yup from "yup";
import { companyTypes } from "../../beneficiaries/model/entity-types";
import { PASSWORD_REQUIREMENTS_TEXT } from "../../registration/model/passwordSchema";
import { countries } from "../../registration/model/countries";

export const adminUserSchema = yup.object({
  firstname: yup.string().required("Please enter the First name"),
  lastname: yup.string().required("Please enter the Last name"),
  email: yup.string().required(),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])(?=.{8,})/,
      PASSWORD_REQUIREMENTS_TEXT
    ),
  confirmPassword: yup
    .string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
  uuid: yup.string().optional().nullable(true),
  role: yup.string().optional().nullable(true),
  country: yup.string().required().oneOf(Array.from(countries.keys())),
  mobileNumber: yup
    .string()
    .required("Please enter your Phone Number")
    .min(1)
    .matches(/^(\+|\d)[0-9]{7,15}$/, "Please enter a valid phone number"),
});

export type AdminUserDto = yup.TypeOf<typeof adminUserSchema>;
export const initialAdminUserData: AdminUserDto = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "",
  uuid: "",
  role: "user:member",
  mobileNumber: "",
};
