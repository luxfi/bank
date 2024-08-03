import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import * as SearchApi from "./SearchApi";
import Pagination from 'react-js-pagination';

export const searchTransactions = createAsyncThunk(
  "search/transactions",
  async (props: { query: string, gateway?: string }, thunkApi) => {
    thunkApi.getState();
    return SearchApi.searchTransactions(props.query, props.gateway);
  }
);
interface SearchState {
  status: "loading" | "idle" | "error";
  error: string;
  pageInfo: any;
  query: string;
  transactions: Array<any>
}
const initialState: SearchState = {
  status: "idle",
  error: "",
  pageInfo: {current_page: 1, per_page: 15, total_entries: 0},
  query: '',
  transactions: []
};

export const searchSlice = createSlice({
  name: "search",
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchTransactions.fulfilled, (state, action) => {
        state.status = 'idle';
        if(action.payload?.pagination) {
          state.pageInfo = action.payload.pagination;
        } else {
          state.pageInfo = {current_page: 1, per_page: 15, total_entries: 0};
        }
        if(action.payload?.transactions) {
          state.transactions = action.payload.transactions;
        }
        else {
          state.transactions = [];
        }
      })
      .addCase(searchTransactions.rejected, (state, action) => {
        state.status = 'idle';
        state.transactions = [];
        state.pageInfo = {current_page: 1, per_page: 15, total_entries: 0};
        state.error = 'Sorry. Something went wrong.';
      });
  },
});
export const selectTransactions = (state: RootState) => state.search.transactions;
export const selectPagination = (state: RootState) => state.search.pageInfo;
export const selectStatus = (state:RootState) => state.search.status;
export const selectQuery = (state:RootState) => state.search.query;
export const { setPageInfo, setTransactions, setQuery } = searchSlice.actions;
export default searchSlice.reducer;
