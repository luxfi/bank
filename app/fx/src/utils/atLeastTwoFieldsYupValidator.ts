import * as Yup from 'yup';

const atLeastTwoRequiredMessage =
  'Please enter at least two of the fields: IBAN, BIC SWIFT, Account Number, Sort Code.';

export const atLeastTwoFieldsValidation = (fields: string[]) => {
  return Yup.string()
    .nullable()
    .test('at-least-two', atLeastTwoRequiredMessage, function (value) {
      const { parent } = this;
      const filledFields = fields.filter(
        (field: string) => parent[field]
      ).length;
      return filledFields >= 2 || value !== undefined;
    });
};
