import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User } from "../auth/AuthApi";
import * as AdminClientsApi from "./AdminClientsApi";

const LIMIT = 20;

export interface UsersState {
  status: "loading" | "idle" | "error";
  error: string;
  users: any[]
}

const initialState: UsersState = {
  status: "idle",
  error: "",
  users: [],
};

export const listArchivedUsers = createAsyncThunk(
  "archived-users/list",
  async () => {
    const data = await AdminClientsApi.getArchivedUsers();
    if(data.users) 
      return data.users;
    else
      throw new Error('Failed to fetch archived users');
  }
);

export const archivedUsersSlice = createSlice({
  name: "admin/users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listArchivedUsers.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(listArchivedUsers.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't fetch the users, please try again.`;
        }
      })
      .addCase(listArchivedUsers.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.users = action.payload;
      })
  },
});

// export const {} = UsersSlice.actions;

export const selectArchivedUsers = (state: RootState) =>
  state.archivedUsers.users ;
export const selectLoading = (state:RootState) => state.archivedUsers.status === 'loading';

export default archivedUsersSlice.reducer;
