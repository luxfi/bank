import * as yup from "yup";
export const paymentCurrencyInfoSchema = yup.object({
  currency: yup.string()
        .required('Please select a currency'),
  amount: yup.number().required('You have to enter a number').test('compare-amount', 'Amount has to be greater than zero', function(value) {
    return Number(value)>0;
  }),
  beneficiary: yup.string()
  .required('Please select a Beneficiary'),
})

export type CurrencyMetadtaDto = yup.TypeOf<typeof paymentCurrencyInfoSchema>;
