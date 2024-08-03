import * as yup from 'yup'

export const splitAmountSchema = yup.object({
  split_amount:yup.string().test("amount-compare", "Amount must be greater than 1.", function(value){
    return this.parent.split_amount >= 1;
  }).required('Please enter the Amount greater than 1.'),
});

export const currencyAmountSchema = yup.object({
  sell_currency: yup.string().required('Please select Currency to Sell'),
  buy_currency: yup.string().required('Please select Currency to Buy'),
  fixed_side: yup.string(),
  amount:yup.string().test("amount-compare", "Conversion amount must be greater than 1.00", function(value){
    return this.parent.amount >= 1;
  }).required('Please enter the Amount greater than 1.'),
});

export const currencyQuoteSchema = yup.object({
    settlement_date: yup.string(),
    conversion_date: yup.string(),
    short_reference: yup.string(),
    creator_contact_id: yup.string(),
    account_id: yup.string(),
    currency_pair: yup.string(),
    status: yup.string(),
    buy_currency: yup.string(),
    sell_currency: yup.string(),
    client_buy_amount: yup.string(),
    client_sell_amount: yup.string(),
    fixed_side: yup.string(),
    core_rate: yup.string(),
    partner_rate: yup.string(),
    partner_buy_amount: yup.string(),
    partner_sell_amount: yup.string(),
    client_rate: yup.string(),
    deposit_required: yup.string(),
    deposit_amount: yup.string(),
    deposit_currency: yup.string(),
    deposit_status: yup.string(),
    deposit_required_at: yup.string(),
    payment_ids: yup.string(),
    unallocated_funds: yup.string(),
    unique_request_id: yup.string(),
    mid_market_rate: yup.string(),
})

export type CurrencyAmountMetadataDto = yup.TypeOf<typeof currencyAmountSchema>;
export type CurrencyQuoteMetadataDto = yup.TypeOf<typeof currencyQuoteSchema>;
