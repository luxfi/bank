import * as yup from 'yup';

export const basicInfoSchema = yup.object({
  firstname: yup.string()
      .required('Please enter your first name.')
      .min(1),
  lastname: yup.string()
      .required('Please enter your last name.')
      .min(1),
  email: yup.string()
      .required('Please enter a valid email.')
      .email('Please enter a valid email.'),
  recaptcha: yup.string().required("Please tick the 'I am not a robot' checkbox").test('test_recaptcha_true', '', function(value){
    if(value !== 'true'){
        return this.createError({ message: `Please tick the 'I am not a robot' checkbox` })
    }
    return true
}),
});
