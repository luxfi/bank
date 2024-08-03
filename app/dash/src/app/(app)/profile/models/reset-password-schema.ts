import * as yup from 'yup';

export const resetPasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});
