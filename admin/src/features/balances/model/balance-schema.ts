import * as yup from "yup";

export const balanceSchema = yup.object({
  account_id: yup.string().required(),
  currency: yup.string().required(),
  amount: yup.string()
})

export const currencySchema = yup.object({
  code: yup.string().required(),
  decimal_places: yup.string(),
  name: yup.string().required(),
  online_trading: yup.bool(),
  can_buy: yup.bool(),
  can_sell: yup.bool()
})
