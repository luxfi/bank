import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { submitRegistrationRequestFn } from "./RequestRegistrationApi";

export const submitRegistrationRequest: any = createAsyncThunk(
  "requestRegistration/submitRegistrationRequest",
  async (data, thunkApi) => {
    return await submitRegistrationRequestFn(data);
  }
);

interface IRequest {
  firstname: string;
  lastname: string;
  email: string;
  mobileNumber: string;
}

interface RequestRegistrationState {
  requestRegistration: IRequest;
  status: string | null;
  error: string;
  data: {
    firstname: string;
    lastname: string;
    email: string;
    mobileNumber: string;
  };
}

const initialState: RequestRegistrationState = {
  requestRegistration: {
    firstname: "",
    lastname: "",
    email: "",
    mobileNumber: "",
  },
  status: null,
  error: "",
  data: {
    firstname: "",
    lastname: "",
    email: "",
    mobileNumber: "",
  },
};

const requestRegistrationSlice = createSlice({
  name: "requestRegistration",
  initialState,
  reducers: {
    setInfo(state, action: PayloadAction<IRequest>) {
      state.requestRegistration = { ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRegistrationRequest.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitRegistrationRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(submitRegistrationRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "An error occurred while submitting request";
      });
  },
});

export const { setInfo } = requestRegistrationSlice.actions;

export default requestRegistrationSlice.reducer;
