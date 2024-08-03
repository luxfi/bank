import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import * as DashboardApi from "./DashboardApi";
import { toDoList } from './DashboardApi';
export const loadToDoList = createAsyncThunk(
  "dashboard/toDoList",
  async (_, thunkApi) => {
    thunkApi.getState();
    return DashboardApi.toDoList();
  }
);
export interface DashboardState {
  status: "loading" | "idle" | "error";
  error: string;
  toDoList: ToDoList;
}
export interface ToDoList {
  awaitingFunds: any;
  failedPayments: any;
  pendingTransactions: any;
  completedConversions: any;
  completedTransactions: any;
  completedPayments: any;
}
const initialToDoList = {
  awaitingFunds: 0,
  failedPayments: 0,
  pendingTransactions: 0,
  completedConversions: 0,
  completedTransactions: 0,
  completedPayments: 0
}
const initialState: DashboardState = {
  status: "idle",
  error: "",
  toDoList: initialToDoList
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setToDoList: (
      state,
      action: PayloadAction<ToDoList>
    ) => {
      state.toDoList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadToDoList.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadToDoList.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "The summary data couldn't be loaded.";
        }
      })
      .addCase(loadToDoList.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.toDoList = action.payload;
      })
  },
});

export const selectTodoList = (state: RootState) => state.dashboard.toDoList;
export const selectToDoStatus = (state: RootState) => state.dashboard.status;
export const selectToDoError = (state: RootState) => state.dashboard.error;
export const { setToDoList } = dashboardSlice.actions;
export default dashboardSlice.reducer;
