import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import * as BalancesApi from "./BalancesApi";
import { BalanceResponse, CurrenciesResponse } from "./model/balance-response";

export interface BalancesListState {
  status: "loading" | "idle" | "error";
  error: string;
  balances: BalanceResponse[];
  currencies: CurrenciesResponse[];
}

const initialState: BalancesListState = {
  status: "idle",
  error: "",
  balances: [],
  currencies: [],
}

export const loadBalancesList = createAsyncThunk(
  "balancesList/load",
 async (_, thunkApi) => {
  thunkApi.getState();
  return BalancesApi.balance_list();
 }
);
export const loadCurrenciesList = createAsyncThunk(
  "currenciesList/load",
 async (_, thunkApi) => {
  thunkApi.getState();
  return BalancesApi.currencies_list();
 }
);

export const balancesListSlice = createSlice({
  name: "balances",
  initialState,
  reducers: {
    setBalancesList: (
      state, 
      action: PayloadAction<BalanceResponse[]>
    )=>{
      state.status = "idle";
      state.error = "";
      state.balances = action.payload;
    }
  },
  extraReducers: (builder) => { 
    builder
      .addCase(loadBalancesList.pending, (state)=>{
        state.status = "loading";
        state.error = ""
      })
      .addCase(loadBalancesList.rejected, (state, action) => { 
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
       })
      .addCase(loadBalancesList.fulfilled, (state, action) => { 
        state.status = "idle";
        state.error = "";
        state.balances = action.payload;
       })
       .addCase(loadCurrenciesList.pending, (state)=>{
        state.status = "loading";
        state.error = ""
      })
      .addCase(loadCurrenciesList.rejected, (state, action) => { 
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
       })
      .addCase(loadCurrenciesList.fulfilled, (state, action) => { 
        state.status = "idle";
        state.error = "";
        state.currencies = action.payload;
       })
   }
})

export const selectBalances = (state: RootState) =>
  state.balancesList.balances;
export const selectCurrencies = (state: RootState) =>
  state.balancesList.currencies;
export const selectBalanceStatus = (state: RootState) => state.balancesList.status;
export const selectBalanceError = (state: RootState) => state.balancesList.error;
export const { setBalancesList } = balancesListSlice.actions;
export default balancesListSlice.reducer;
