import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import * as ViewCurrencyApi from "./ViewCurrencyApi";

export interface viewPaymentDetailState {
  status: 'loading' | 'idle' | 'error';
  error: string;
  data: ViewPaymentDetailData;
}
export interface ViewPaymentDetailData {
  beneficiary_nickname: string;
  beneficiary_country: string;
  bene_bank_country: string;
  currency: string;
  bank_holder: string;
  beneficiary_type: string;


  ////////////////////
  bank_regular_payment: string;
  bank_iban: string;
  bank_address: string;
  bank_city: string;
  bank_country: string;
  bank_priority_payment: string;

}
const initialViewPaymentDetailData = {
  beneficiary_nickname: '',
  beneficiary_country: '',
  bene_bank_country: '',
  currency: '',
  bank_holder: '',
  beneficiary_type: '',
///////////////////
  bank_regular_payment: '',
  bank_iban: '',
  bank_address: '',
  bank_city: '',
  bank_country: '',
  bank_priority_payment: ''

}
const initialState: viewPaymentDetailState = {
  status: 'idle',
  error: '',
  data: initialViewPaymentDetailData,
}
interface BeneficiaryDetail {
  beneficiary_nickname: string;
  beneficiary_country: string;
  bene_bank_country: string;
  currency: string;
  bank_holder: string;
  beneficiary_type: string;
}
interface BankDetail {
  bank_regular_payment: string;
  bank_iban: string;
  bank_address: string;
  bank_city: string;
  bank_country: string;
  bank_priority_payment: string;
}
interface Beneficiary {
  name: string;
  bank_account_holder_name: string;
  bank_country: string;
  currency: string;
}
export const postPaymentBeneficiary = createAsyncThunk(
  "currencyBeneficiary/save",
  async (formData: Beneficiary, thunkApi)=>{
    thunkApi.getState();
    return ViewCurrencyApi.currency_beneficiary(formData);
  }
)

export const viewPaymentDetailSlice = createSlice({
  name: 'viewPaymentDetail',
  initialState,
  reducers: {
    setBeneficiaryInformation: (state, action: PayloadAction<BeneficiaryDetail>)=>{
      state.data.beneficiary_nickname = action.payload.beneficiary_nickname;
      state.data.beneficiary_country = action.payload.beneficiary_country;
      state.data.bene_bank_country = action.payload.bene_bank_country;
      state.data.currency = action.payload.currency;
      state.data.bank_holder = action.payload.bank_holder;
      state.data.beneficiary_type = action.payload.beneficiary_type;
    },
    setBankInformation: (state, action: PayloadAction<BankDetail>)=>{
      state.data.bank_regular_payment = action.payload.bank_regular_payment;
      state.data.bank_iban = action.payload.bank_iban;
      state.data.bank_address = action.payload.bank_address;
      state.data.bank_city = action.payload.bank_city;
      state.data.bank_country = action.payload.bank_country;
      state.data.bank_priority_payment = action.payload.bank_priority_payment;
  },
}
});
export const selectBankInformation = (state: RootState) =>
  state.viewPaymentDetail.data;
export const {
  setBeneficiaryInformation,
  setBankInformation
} = viewPaymentDetailSlice.actions;

export default viewPaymentDetailSlice.reducer;
