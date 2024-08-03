import * as Yup from 'yup';

export interface IDetailsOfRegistrar {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whoTheyAre: string;
  email: string;
}

export const validationForm = Yup.object({
  firstName: Yup.string().required('Enter your first name'),
  lastName: Yup.string().required('Enter your last name'),
  email: Yup.string().required('Enter your email').email('Enter a valid email'),
  phoneNumber: Yup.string().required('Enter your phone number'),
  whoTheyAre: Yup.string().required('Enter who they are'),
});
