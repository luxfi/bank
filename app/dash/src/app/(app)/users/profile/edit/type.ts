import * as Yup from 'yup';

export interface IFormAdmin {
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  country: string;
  role: string;
}

export interface IFormSuperAdmin {
  email: string;
  firstName: string;
  lastName: string;
}

export const validationSchemaAdmin = Yup.object({
  firstName: Yup.string().required('Enter your First Name'),
  lastName: Yup.string().required('Enter your Last Name'),
  country: Yup.string().required('Enter your country'),
  mobileNumber: Yup.string().required('Enter your Phone Number'),
  email: Yup.string().email().required('Enter your email'),
  role: Yup.string().required('Enter your user role'),
});

export const validationSchemaSuperAdmin = Yup.object({
  firstName: Yup.string().required('Enter your First Name'),
  lastName: Yup.string().required('Enter your Last Name'),
  email: Yup.string().email().required('Enter your email'),
});

export const optionsRole = [
  { label: 'Super Admin', value: 'admin:super' },
  { label: 'Admin', value: 'user:admin' },
  { label: 'Manage', value: 'user:manager' },
  { label: 'Member', value: 'user:member' },
  { label: 'Viewer', value: 'user:viewer' },
];
