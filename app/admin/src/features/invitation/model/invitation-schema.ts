import * as yup from "yup";
import { emailExists } from "../../registration/RegistrationApi";
import { userRoles } from "./user-roles";
import { countries } from "../../registration/model/countries";

export const invitationSchema = yup.object({
  firstname: yup.string().required("Please enter the first name.").min(1),
  lastname: yup.string().required("Please enter the last name.").min(1),
  email: yup
    .string()
    .required("Please enter a valid email.")
    .email("Please enter a valid email."),
  country: yup.string().required().oneOf(Array.from(countries.keys())),
  userRole: yup
    .string()
    .oneOf(Array.from(userRoles().keys()), "Please select a valid user role.")
    .required("Please select a valid user role."),
  mobileNumber: yup
    .string()
    .required("Please enter your Phone Number").min(1)
    .matches(/^(\+|\d)[0-9]{7,15}$/, "Please enter a valid phone number"),
});

export type invitationDto = yup.TypeOf<typeof invitationSchema>;
