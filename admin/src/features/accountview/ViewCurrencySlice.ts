import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../../app/store";
import { QuoteFromResponse, QuotePostFromResponse, SplitPreviewFromResponse } from "./model/currencyQuote-response";
import * as ViewCurrencyApi from "./ViewCurrencyApi";
export const deleteConversion = createAsyncThunk(
  "deleteConversion",
  async (uuid: string, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    return ViewCurrencyApi.deleteConversionData(uuid);
  }
);
export interface ViewCurrencyState {
  host: string;
  status: 'loading' | 'idle' | 'error';
  error: string;
  // data: ViewCurrencyData;
  currencyAmountData: CurrencyAmount;
  quoteFromResponseData: QuoteFromResponse;
  currencyDateData: CurrencyDate;
  quotePostResponse: QuotePostFromResponse;
  splitFromResponseData: SplitPreviewFromResponse,
  splitPreviewFromResponseData: SplitPreviewFromResponse,
}

export const quoteFromResponseInitData = {
  settlement_cut_off_time: '',
  currency_pair: '',
  client_buy_currency: '',
  client_sell_currency: '',
  client_buy_amount: '',
  client_sell_amount: '',
  fixed_side: '',
  client_rate: '',
  partner_rate: '',
  core_rate: '',
  deposit_required: '',
  deposit_amount: '',
  deposit_currency: '',
  mid_market_rate: '',
}
export const quotePostFromResponseInitData = {
  id: '',
  settlement_date: '',
  conversion_date: '',
  short_reference: '',
  creator_contact_id: '',
  account_id: '',
  currency_pair: '',
  status: '',
  buy_currency: '',
  sell_currency: '',
  client_buy_amount: '',
  client_sell_amount: '',
  fixed_side: '',
  core_rate: '',
  partner_rate: '',
  partner_buy_amount: '',
  partner_sell_amount: '',
  client_rate: '',
  deposit_required: '',
  deposit_amount: '',
  deposit_currency: '',
  deposit_status: '',
  deposit_required_at: '',
  payment_ids: '',
  unallocated_funds: '',
  unique_request_id: '',
  created_at: '',
  mid_market_rate: '',
}
const currencyAmountInitData = {
  sell_currency: 'GBP',
  buy_currency: '',
  fixed_side: 'buy',
  amount: '',
}
const currencyDateInitData = {
  conversion_date: ''
}
const splitFromResponseInitData = {
  parent_conversion: {
    id: '',
    short_reference: '',
    sell_amount: '',
    sell_currency: '',
    buy_amount: '',
    buy_currency: '',
    settlement_date: '',
    conversion_date: '',
    status: '',
  },
  child_conversion: {
    id: '',
    short_reference: '',
    sell_amount: '',
    sell_currency: '',
    buy_amount: '',
    buy_currency: '',
    settlement_date: '',
    conversion_date: '',
    status: '',
  },
}
const initialState: ViewCurrencyState = {
  host: '',
  status: 'idle',
  error: '',
  // data: initialViewCurrencyData,
  currencyAmountData: currencyAmountInitData,
  quoteFromResponseData: quoteFromResponseInitData,
  currencyDateData: currencyDateInitData,
  quotePostResponse: quotePostFromResponseInitData,
  splitFromResponseData: splitFromResponseInitData,
  splitPreviewFromResponseData: splitFromResponseInitData,
}

interface CurrencyAmount {
  sell_currency: string;
  buy_currency: string;
  fixed_side: string;
  amount: string;
  buy_account_id?: string;
  sell_account_id?: string;
}

interface CurrencyAmountWithDate {
  sell_currency: string;
  buy_currency: string;
  fixed_side: string;
  amount: string;
  conversion_date: string;
  term_agreement: boolean;
  quoteId?: string;
  buy_account_id?: string;
  sell_account_id?: string;
}


interface CurrencyDate {
  conversion_date: string;
}
export const editConversion = createAsyncThunk(
  "conversion/edit",
  async (formData:ViewCurrencyApi.EditConversionDto, thunkApi)=>{
    thunkApi.getState();
    return ViewCurrencyApi.edit_conversion(formData)
  }
)
export const splitConversion = createAsyncThunk(
  "splitConversion/split",
  async (formData:ViewCurrencyApi.SplitPreviewDto, thunkApi)=>{
    thunkApi.getState();
    return ViewCurrencyApi.split_conversion(formData)
  }
)
export const splitConversionPreview = createAsyncThunk(
  "splitConversion/preview",
  async (formData:ViewCurrencyApi.SplitPreviewDto, thunkApi)=>{
    thunkApi.getState();
    return ViewCurrencyApi.split_conversion_preview(formData)
  }
)

export const postCurrencyQuote = createAsyncThunk(
  "currencyQuote/save",
  async (formData:CurrencyAmountWithDate, thunkApi)=>{
    thunkApi.getState();
    // console.log('save quote', formData);
    return ViewCurrencyApi.currency_quote(formData)
  }
)

export const loadCurrencyQuote = createAsyncThunk(
  "currencyQuote/load",
  async (formData:CurrencyAmountWithDate, thunkApi)=>{
    thunkApi.getState();
    return ViewCurrencyApi.select_quote(formData);
  }
)

export const viewCurrencySlice = createSlice({
  name: 'viewCurrency',
  initialState,
  reducers: {
    setCurrencyAmount: (state, action: PayloadAction<CurrencyAmount>)=>{
      // state.currencyAmountData.sell_currency = action.payload.sell_currency;
      // state.currencyAmountData.buy_currency = action.payload.buy_currency;
      // state.currencyAmountData.fixed_side = action.payload.fixed_side;
      // state.currencyAmountData.amount = action.payload.amount;
      state.currencyAmountData = action.payload;
    },
    resetQuoteFromResponseData: (state)=>{
      state.quoteFromResponseData = quoteFromResponseInitData;
    },
    resetQuotePostResponseData: (state)=>{
      state.quotePostResponse = quotePostFromResponseInitData;
    },
    setCurrencyDate: (state, action: PayloadAction<CurrencyDate>)=>{
      state.currencyDateData.conversion_date = action.payload.conversion_date;
    },
  },
  extraReducers:(builder)=>{
    builder
      .addCase(loadCurrencyQuote.pending, (state)=>{
        state.host = 'loadCurrencyQuote';
        state.status = "loading";
        state.error = ""
      })
      .addCase(loadCurrencyQuote.rejected, (state, action) => { 
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
       })
      .addCase(loadCurrencyQuote.fulfilled, (state, action) => { 
        state.status = "idle";
        state.error = "";
        state.quoteFromResponseData = action.payload;
       })
      .addCase(postCurrencyQuote.pending, (state)=>{
        state.host = 'postCurrencyQuote';
        state.status = "loading";
        state.error = ""
      })
      .addCase(postCurrencyQuote.rejected, (state, action) => { 
        state.status = "error";
        if (action.error.message) {
           state.error = action.error.message;
         } else {
           state.error = "Balances couldn't be loaded, please try again.";
         }
        })
       .addCase(postCurrencyQuote.fulfilled, (state, action) => { 
          if (action.payload) {
            state.status = "idle";
            state.error = "";
            state.quotePostResponse = action.payload;
          } else {
            state.status = "error";
            state.error = "Failed to create a quote, please try again";
          }
        })
        .addCase(splitConversionPreview.fulfilled, (state, action) => { 
          state.status = "idle";
          state.error = "";
          state.splitPreviewFromResponseData = action.payload;
        })
        .addCase(splitConversionPreview.pending, (state) => {
          state.status = 'loading';
          state.host = 'splitConversionPreview';
          state.error = '';
        })
        .addCase(splitConversionPreview.rejected, (state, action) => {
          state.status = 'error';
          if (action.error.message) {
            state.error = action.error.message;
          } else {
            state.error = 'Conversion preview could not be loaded. Please try again.';
          }
        })
        .addCase(splitConversion.fulfilled, (state, action) => { 
          state.status = "idle";
          state.error = "";
          state.splitFromResponseData = action.payload;
        })
        .addCase(splitConversion.pending, (state) => {
          state.status = 'loading';
          state.host = 'splitConversion';
          state.error = '';
        })
        .addCase(splitConversion.rejected, (state, action) => {
          state.status = 'error';
          if (action.error.message) {
            state.error = action.error.message;
          } else {
            state.error = 'Split conversion could not be loaded. Please try again.';
          }
        })
        .addCase(editConversion.fulfilled, (state, action) => { 
          state.status = "idle";
          state.error = "";
          state.quotePostResponse = action.payload;
        })
        .addCase(editConversion.pending, (state) => {
          state.status = 'loading';
          state.host = 'editConversion';
          state.error = '';
        })
  }
})

export const {
  setCurrencyAmount,
  setCurrencyDate,
  resetQuoteFromResponseData,
  resetQuotePostResponseData,
} = viewCurrencySlice.actions;
export const selectCurrencyConvert = (state: RootState) =>
  state.viewCurrency.currencyAmountData
export const selectCurrencyApiStatus = (state: RootState) => 
  ({ status: state.viewCurrency.status, host: state.viewCurrency.host, error: state.viewCurrency.error })
export const selectCurrencyQuote = (state: RootState) =>
  state.viewCurrency.quoteFromResponseData
export const selectCurrencyDate = (state: RootState) =>
  state.viewCurrency.currencyDateData
export const selectQuoteData = (state: RootState) =>
  state.viewCurrency.quotePostResponse
export const selectSplitPreviewFromResponseData = (state: RootState) =>
state.viewCurrency.splitPreviewFromResponseData
export const selectSplitFromResponseData = (state: RootState) =>
state.viewCurrency.splitFromResponseData
export const deleteConversionAndReload =
  (uuid: string) => async (dispatch: AppDispatch) => {
    await dispatch(deleteConversion(uuid)).unwrap();
  };
export default viewCurrencySlice.reducer;
