import * as yup from "yup";
import { PASSWORD_REQUIREMENTS_TEXT } from "../../registration/model/passwordSchema";

export const userSchema = yup.object({
  firstname: yup.string().required("Please enter the First name"),
  lastname: yup.string().required("Please enter the Last name"),
  email: yup.string().required(),
  password: yup.string().matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])(?=.{8,})/,
    PASSWORD_REQUIREMENTS_TEXT,
  ),
  confirmPassword: yup
    .string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

export type UserDto = yup.TypeOf<typeof userSchema>;
export const initialUserData: UserDto = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
};
