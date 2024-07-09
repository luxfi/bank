import * as yup from 'yup';

export const expectedVolumeSchema = yup.object({
  expectedVolumeOfTransactions: yup.string().required('Please select expected volume'),
  expectedValueOfTurnover: yup.string(),
  expectedValueOfTurnoverSelect: yup.string().required('Please select an amount')
});
export type ExpectedVolumeDto = yup.TypeOf<typeof expectedVolumeSchema>;

