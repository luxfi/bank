import * as yup from 'yup'


export const paymentPayerMetadataSchema = yup.object({
  payment_date: yup.string(),
  payment_type: yup.string(),
  pay_type: yup.string().required(),
  pay_reason:yup.string().required("Please enter the Reason").min(2),
  pay_reference:yup.string().required("Please enter the Reference").min(2),
  purpose_code:yup.string().transform(v => (v === null ? 'FUNDS' : v)).required("Please select Payment Purpose"),
  payer_type: yup.string().when("pay_type", {
    is: "No",
    then: yup.string().required()
  }),
  payer_country: yup.string()
});

export type PayerMetadataDto = yup.TypeOf<typeof paymentPayerMetadataSchema>;
export const paymentCreateMetadataSchema = yup.object({
    id: yup.string(),
    amount: yup.string(),
    beneficiary_id: yup.string(),
    currency: yup.string(),
    reference: yup.string(),
    reason: yup.string(),
    status: yup.string(),
    creator_contact_id: yup.string(),
    payment_type: yup.string(),
    payment_date: yup.string(),
    transferred_at: yup.string(),
    authorisation_steps_required: yup.string(),
    last_updater_contact_id: yup.string(),
    short_reference: yup.string(),
    conversion_id: yup.string(),
    failure_reason: yup.string(),
    payer_id: yup.string(),
    payer_details_source: yup.string(),
    payment_group_id: yup.string(),
    unique_request_id: yup.string(),
    failure_returned_amount: yup.string(),
    ultimate_beneficiary_name: yup.string(),
    purpose_code: yup.string(),
    charge_type: yup.string(),
    fee_amount: yup.string(),
    fee_currency: yup.string(),
});

export type PaymentCreateMetadataDto = yup.TypeOf<typeof paymentCreateMetadataSchema>;
