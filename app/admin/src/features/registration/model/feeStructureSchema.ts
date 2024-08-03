import * as yup from "yup";

export const feeStructureSchema = yup.object({
  conversion_amount: yup.string(),
  SEPA_amount: yup.string(),
  SEPA_currency: yup.string(),
  SEPA_INSTANT_amount: yup.string(),
  SEPA_INSTANT_currency: yup.string(),
  TARGET2_amount: yup.string(),
  TARGET2_currency: yup.string(),
  SWIFT_amount: yup.string(),
  SWIFT_currency: yup.string(),
  CHAPS_amount: yup.string(),
  CHAPS_currency: yup.string(),
  FASTER_PAYMENTS_amount: yup.string(),
  FASTER_PAYMENTS_currency: yup.string(),
});

export type FeeStructureDto = yup.TypeOf<typeof feeStructureSchema>;
