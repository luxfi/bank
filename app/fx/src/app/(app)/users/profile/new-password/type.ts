import * as Yup from 'yup';

export const validationSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().when('currentPassword', {
    is: (val: string) => !!val?.length,
    then: () =>
      Yup.string().notOneOf(
        [Yup.ref('currentPassword')],
        'New password must be different from current password'
      ),
    otherwise: () => Yup.string().required('Confirm password is required'),
  }),
  confirmPassword: Yup.string().when('newPassword', {
    is: (val: string) => !!val?.length,
    then: () =>
      Yup.string()
        .required()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    otherwise: () => Yup.string().required(''),
  }),
});
