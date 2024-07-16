import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BeneficiaryID, BeneficiaryResponse, CurrencyBeneficiaryResponse } from "./model/beneficiary-response";
import * as BeneficiariesApi from "./BeneficiariesApi";
import { AppDispatch, RootState } from "../../app/store";

export interface BeneficiariesListState {
  status: "loading" | "idle" | "error";
  error: string;
  beneficiaries: BeneficiaryResponse[];
  beneficiaryId: BeneficiaryID;
  currency_beneficiaries: CurrencyBeneficiaryResponse[];
}

const initialState: BeneficiariesListState = {
  status: "idle",
  error: "",
  beneficiaries: [],
  beneficiaryId: {
    uuid: '',
  },
  currency_beneficiaries: [],
};

export const loadBeneficiariesList = createAsyncThunk(
  "beneficiariesList/load",
  async (state, thunkApi) => {
    thunkApi.getState();
    return BeneficiariesApi.list();
  }
);
const deleteBeneficiary = createAsyncThunk(
  "beneficiariesList/delete",
  async (uuid: string, thunkApi) => {
    thunkApi.getState();
    return BeneficiariesApi.deleteBeneficiary(uuid);
  }
);

export const approveBeneficiary = createAsyncThunk(
  "beneficiariesList/approve",
  async (uuid: string, thunkApi) => {
    thunkApi.getState();
    return BeneficiariesApi.approveBeneficiary(uuid);
  }
);

export const loadCurrencyBeneficiariesList = createAsyncThunk(
  "currencycloud/beneficiaries",
  async (currency: string, thunkApi) => {
    thunkApi.getState();
    return BeneficiariesApi.currency_list(currency);
  }
);

export const beneficiariesListSlice = createSlice({
  name: "beneficiaries",
  initialState,
  reducers: {
    setBeneficiariesList: (
      state,
      action: PayloadAction<BeneficiaryResponse[]>
    ) => {
      state.status = "idle";
      state.error = "";
      state.beneficiaries = action.payload;
    },
    setBeneficiary: (
      state,
      action: PayloadAction<BeneficiaryID>
    ) => {
      state.status = "idle";
      state.error = "";
      state.beneficiaryId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBeneficiariesList.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadBeneficiariesList.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Beneficiaries couldn't be loaded, please try again.";
        }
      })
      .addCase(loadBeneficiariesList.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.beneficiaries = action.payload;
      })
      .addCase(loadCurrencyBeneficiariesList.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadCurrencyBeneficiariesList.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Beneficiaries couldn't be loaded, please try again.";
        }
      })
      .addCase(loadCurrencyBeneficiariesList.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.currency_beneficiaries = action.payload;
      })
      .addCase(deleteBeneficiary.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(deleteBeneficiary.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Beneficiaries couldn't be loaded, please try again.";
        }
      })
      .addCase(deleteBeneficiary.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.beneficiaries = [];
      });
  },
});

export const deleteBeneficiaryAndReload =
  (uuid: string) => async (dispatch: AppDispatch) => {
    await dispatch(deleteBeneficiary(uuid)).unwrap();
    await dispatch(loadBeneficiariesList());
  };
export const approveBeneficiaryAndReload =
  (uuid: string) => async (dispatch: AppDispatch) => {
    await dispatch(approveBeneficiary(uuid)).unwrap();
    await dispatch(loadBeneficiariesList());
  };
export const selectBeneficiaries = (state: RootState) =>
  state.beneficiariesList.beneficiaries;
export const selectCurrencyBeneficiaries = (state: RootState) =>
  state.beneficiariesList.currency_beneficiaries;
export const selectBeneficiaryId = (state: RootState) =>
  state.beneficiariesList.beneficiaryId;
export const { setBeneficiariesList, setBeneficiary } = beneficiariesListSlice.actions;

export default beneficiariesListSlice.reducer;
