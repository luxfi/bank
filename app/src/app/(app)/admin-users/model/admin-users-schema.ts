import { AdminRoles } from '@/models/auth';

import * as yup from 'yup';

import { IFormValuesCreateUser } from './types';

export const adminUsersSchema = yup.object({
  firstname: yup.string().when('entityType', {
    is: 'individual',
    then: () => yup.string().required('Please enter the First Name'),
    otherwise: () => yup.string(),
  }),
  lastname: yup.string().when('entityType', {
    is: 'individual',
    then: () => yup.string().required('Please enter the Last name'),
    otherwise: () => yup.string(),
  }),
  email: yup.string().email('Please enter a valid email address'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  uuid: yup.string().optional().nullable(),
  role: yup.string().optional().nullable(),
});

export const InitialValues: IFormValuesCreateUser = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  uuid: '',
  role: AdminRoles[0],
};
