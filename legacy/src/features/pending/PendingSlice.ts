import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ITransaction } from "./models/Transaction";
import * as PendingApi from "./PendingApi";

export const pendingTransactions = createAsyncThunk(
  "search/pending_transactions",
  async (props: { query: string; gateway?: string }, thunkApi) => {
    thunkApi.getState();
    return PendingApi.pendingTransactionsGet(props.query);
  }
);

interface PendingTransactionState {
  status: "loading" | "idle" | "error";
  error: string;
  pageInfo: any;
  query: string;
  transactions: Array<ITransaction>;
  details: ITransaction;
}
const initialState: PendingTransactionState = {
  status: "idle",
  error: "",
  pageInfo: { current_page: 1, per_page: 15, total_entries: 0 },
  query: "",
  transactions: [],
  details: {} as ITransaction,
};

export const pendingSlice = createSlice({
  name: "pending",
  initialState,
  reducers: {
    setPageInfo: (state, action: PayloadAction<any>) => {
      state.pageInfo = action.payload;
    },
    setTransactions: (state, action: PayloadAction<any>) => {
      state.transactions = action.payload;
    },
    setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(pendingTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(pendingTransactions.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload?.pagination) {
          state.pageInfo = action.payload.pagination;
        } else {
          state.pageInfo = { current_page: 1, per_page: 15, total_entries: 0 };
        }
        if (action.payload?.transactions) {
          state.transactions = action.payload.transactions;
        } else {
          state.transactions = [];
        }
        if (action.payload?.id) {
          state.details = action.payload;
        }
      })
      .addCase(pendingTransactions.rejected, (state, action) => {
        state.status = "idle";
        state.transactions = [];
        state.pageInfo = { current_page: 1, per_page: 15, total_entries: 0 };
        state.error = "Sorry. Something went wrong.";
      });
  },
});
export const selectPendingTransactions = (state: RootState): ITransaction[] =>
  state.pending.transactions;
export const selectPendingDetails = (state: RootState): ITransaction =>
  state.pending.details;
export const selectPendingPagination = (state: RootState) =>
  state.pending.pageInfo;
export const selectPendingStatus = (state: RootState) => state.pending.status;
export const selectPendingQuery = (state: RootState) => state.pending.query;
export const { setPageInfo, setTransactions, setQuery } = pendingSlice.actions;
export default pendingSlice.reducer;
