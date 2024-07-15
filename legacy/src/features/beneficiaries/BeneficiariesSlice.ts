import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import * as BeneficiariesApi from "./BeneficiariesApi";
import {
  BeneficiaryDto,
  beneficiaryDtoFromResponse,
} from "./model/beneficiary-dto";
import { initialBeneficiaryValues } from "./model/beneficiary-initial-values";

export interface BeneficiariesState {
  status: "loading" | "idle" | "error";
  error: string;
  beneficiaryUuid: string;
  beneficiaryData: BeneficiaryDto;
  bankDetails: {
    name: string;
    address: string;
  };
  errorDetails: {
    bankCountry: string;
    country: string;
    city: string;
    address: string;
  }
}

const initialBankDetails = {
  name: "",
  address: "",
};
const initialErrorDetails = {
  bankCountry: "",
  country: '',
  city: '',
  address: '',
}
const initialState: BeneficiariesState = {
  status: "idle",
  error: "",
  beneficiaryUuid: "",
  beneficiaryData: initialBeneficiaryValues,
  bankDetails: initialBankDetails,
  errorDetails: initialErrorDetails
};

export const submitBeneficiaryForm = createAsyncThunk(
  "beneficiaries/submit",
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const beneficiaryData = selectBeneficiaryData(state);
    const uuid = state.beneficiaries.beneficiaryUuid;

    if (uuid && uuid !== "") {
      return BeneficiariesApi.update(uuid, beneficiaryData);
    } else {
      return BeneficiariesApi.create(beneficiaryData);
    }
  }
);

export const reviewBeneficiary = createAsyncThunk(
  "beneficiaries/review",
  async (_, thunkApi) => {
    return BeneficiariesApi.review(
      selectBeneficiaryData(thunkApi.getState() as RootState)
    );
  }
);

export const fetchBeneficiary = createAsyncThunk(
  "beneficiaries/fetch",
  async (uuid: string, thunkApi) => {
    return BeneficiariesApi.fetch(uuid);
  }
);

export const beneficiariesSlice = createSlice({
  name: "beneficiaries",
  initialState,
  reducers: {
    updateBeneficiaryData: (state, action: PayloadAction<BeneficiaryDto>) => {
      state.beneficiaryData = action.payload;
    },
    resetBeneficiaryData: (state) => {
      state.beneficiaryUuid = "";
      state.beneficiaryData = initialBeneficiaryValues;
      state.bankDetails = initialBankDetails;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBeneficiaryForm.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitBeneficiaryForm.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Beneficiary couldn't be added, please try again.";
        }
      })
      .addCase(submitBeneficiaryForm.fulfilled, (state) => {
        state.status = "idle";
        state.error = "";
        state.beneficiaryData = initialBeneficiaryValues;
        state.bankDetails = initialBankDetails;
      })

      .addCase(reviewBeneficiary.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(reviewBeneficiary.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Beneficiary couldn't be validated, please try again.";
        }
      })
      .addCase(reviewBeneficiary.fulfilled, (state, action) => {
        // console.log('8888888888888888', action.payload);
        state.status = "idle";
        state.error = "";
        state.bankDetails = {
          name: action.payload.bankName,
          address: action.payload.bankAddress,
        };
        state.errorDetails = {
          bankCountry: action.payload.bankCountry,
          country: action.payload.country,
          city: action.payload.city,
          address: action.payload.address,
        }
      })
      .addCase(fetchBeneficiary.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchBeneficiary.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Beneficiary couldn't be loaded, please try again.";
        }
      })
      .addCase(fetchBeneficiary.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.beneficiaryUuid = action.payload.uuid;
        state.beneficiaryData = beneficiaryDtoFromResponse(action.payload);
        state.bankDetails = initialBankDetails;
      });
  },
});

export const selectBeneficiaryData = (state: RootState) =>
  state.beneficiaries.beneficiaryData;
export const selectErrorData = (state: RootState) => state.beneficiaries.errorDetails;
export const selectBankDetails = (state: RootState) =>
  state.beneficiaries.bankDetails;
export const selectBeneficiariesStatus = (state: RootState) =>
  state.beneficiaries.status;
export const selectBeneficiariesError = (state: RootState) =>
  state.beneficiaries.error;

export const { updateBeneficiaryData, resetBeneficiaryData} =
  beneficiariesSlice.actions;

export default beneficiariesSlice.reducer;
