import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import * as ViewCurrencyApi from "./ViewCurrencyApi";
export interface ViewPercentState {
  status: 'loading' | 'idle' | 'error';
  error: string;
  data: ViewPercentData;
}

export interface ViewPercentData{
  amount: string;
}
const initialViewPercentData = {
  amount: ''
}

const initialState: ViewPercentState = {
  status: 'idle',
  error: '',
  data: initialViewPercentData,
}

interface PercentAmount {
  amount: string;
}
export const postTopUpMargin = createAsyncThunk(
  "currencyTopUpMargin/save",
  async (formData: any, thunkApi)=>{
    thunkApi.getState();
    return ViewCurrencyApi.currency_topup(formData);
  }
)

export const viewPercentSlice = createSlice({
  name: 'viewPercent',
  initialState,
  reducers: {
    setPercentAmount: (state, action: PayloadAction<PercentAmount>)=>{
      state.data.amount = action.payload.amount;
    },
  }
});
export const {
  setPercentAmount
} = viewPercentSlice.actions;
export default viewPercentSlice.reducer;
