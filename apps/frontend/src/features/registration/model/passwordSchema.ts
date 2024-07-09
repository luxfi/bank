import * as yup from 'yup';

export const PASSWORD_REQUIREMENTS_TEXT = "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character";

export const passwordSchema = yup.object({
  password: yup.string()
      .required()
      .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])(?=.{8,})/,
          PASSWORD_REQUIREMENTS_TEXT,
      ),
  confirmPassword: yup.string().test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value
  }),
});
