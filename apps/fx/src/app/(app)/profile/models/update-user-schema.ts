import * as yup from 'yup';

export const updateUserSchema = yup.object({
  firstname: yup.string().required('Please enter the First name'),
  lastname: yup.string().required('Please enter the Last name'),
  username: yup
    .string()
    .email('Please enter a valid email')
    .required('Please enter the Email'),
});
