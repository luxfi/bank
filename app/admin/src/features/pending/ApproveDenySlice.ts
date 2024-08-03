import * as ApproveDenyApi from './ApproveDenyApi';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export const approveTransaction = createAsyncThunk(
  "pending/approve_transaction",
  async (id: string, thunkApi) => {
    thunkApi.getState();
    return ApproveDenyApi.approveTransactionFn(id);
  }
);

export const rejectTransaction = createAsyncThunk(
  "pending/reject_transactions",
  async (props: {id: string, reason: string}, thunkApi) => {
    thunkApi.getState();
    return ApproveDenyApi.rejectTransactionFn(props.id, props.reason);
  }
);

interface PendingTransactionState {
  status: "loading" | "idle" | "error";
  error: string;
  response: any;
}
const initialState: PendingTransactionState = {
  status: "idle",
  error: "",
  response: {},
};

export const approveDenySlice = createSlice({
  name: "pending",
  initialState,
  reducers: {
    setResponse: (state, action: PayloadAction<any>) => {
      state.response = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(approveTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(approveTransaction.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload) {
          state.response = action.payload;
        }
      })
      .addCase(approveTransaction.rejected, (state, action) => {
        state.status = "idle";
        state.error = "Sorry. Something went wrong.";
      })
      .addCase(rejectTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(rejectTransaction.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload) {
          state.response = action.payload;
        }
      })
      .addCase(rejectTransaction.rejected, (state, action) => {
        state.status = "idle";
        state.error = "Sorry. Something went wrong.";
      });
  },
});

export const { setResponse } = approveDenySlice.actions;
export default approveDenySlice.reducer;
