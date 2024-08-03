import { FeeStructureDto } from "./feeStructureSchema";

export const feeStructureInitialValues: FeeStructureDto = {
  conversion_amount: '0.35',
  SEPA_amount: '0.00',
  SEPA_currency: 'EUR',
  SEPA_INSTANT_amount: '0.00',
  SEPA_INSTANT_currency: 'EUR',
  TARGET2_amount: '0.00',
  TARGET2_currency: 'EUR',
  SWIFT_amount: '0.00',
  SWIFT_currency: 'USD',
  CHAPS_amount: '0.00',
  CHAPS_currency: 'GBP',
  FASTER_PAYMENTS_amount: '0.00',
  FASTER_PAYMENTS_currency: 'GBP',
};
