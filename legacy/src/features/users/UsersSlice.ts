import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User } from "../auth/AuthApi";
import * as UsersApi from "./UsersApi";
import { UserDto, initialUserData } from "./model/userSchema";

const LIMIT = 20;

export interface UsersState {
  status: "loading" | "idle" | "error";
  error: string;
  data: Record<string, User[]>;
  totalCount: number;

  selectedUser: UserDto;
}

const initialState: UsersState = {
  status: "idle",
  error: "",
  data: {},
  selectedUser: initialUserData,
  totalCount: 0,
};

export const submitUser = createAsyncThunk(
  "users/submit",
  async (props: { uuid: string }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const data = selectUserData(state);
    if (props.uuid === "new") {
      //return UsersApi.createUser(data);
    } else {
      return UsersApi.updateUser(props.uuid, data);
    }
  }
);

export const listUsers = createAsyncThunk(
  "users/list",
  async (props: { page: number }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const currentUsers = createUsersSelector(props.page)(state);
    if (Array.isArray(currentUsers) && currentUsers.length > 0) {
      return null;
    }

    const { count, users } = await UsersApi.getUsers(props.page);
    return { page: props.page, count, users };
  }
);

export const fetchUser = createAsyncThunk(
  "users/fetch",
  async (props: { uuid: string }, thunkApi) => {
    const user = await UsersApi.getUser(props.uuid);
    return user;
  }
);

export const archiveUser = createAsyncThunk(
  "users/archive",
  async (uuid: string, thunkApi) => {
    const user = await UsersApi.archiveUser(uuid);
    return user;
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUsersData: (state) => {
      state.status = "idle";
      state.error = "";
      state.data = {};
    },
    setSelectedUserData: (state, action: PayloadAction<UserDto>) => {
      state.selectedUser = action.payload;
    },
    resetSelectedUser: (state) => {
      state.status = "idle";
      state.error = "";
      state.selectedUser = initialUserData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listUsers.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't fetch the users, please try again.`;
        }
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";

        if (action.payload?.page && action.payload?.users) {
          state.data[action.payload?.page] = action.payload?.users;
        }

        if (action.payload?.count && action.payload.count > state.totalCount) {
          state.totalCount = action.payload.count;
        }
      })

      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't fetch the user, please try again.`;
        }
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";

        state.selectedUser = {
          firstname: action.payload.firstname,
          lastname: action.payload.lastname,
          email: action.payload.username,
          password: "",
          confirmPassword: "",
        };
      })

      .addCase(submitUser.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitUser.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't submit the user, please try again.`;
        }
      })
      .addCase(submitUser.fulfilled, (state) => {
        state.status = "idle";
        state.error = "";
        state.selectedUser = initialUserData;
      })

      .addCase(archiveUser.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(archiveUser.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't archive the user, please try again.`;
        }
      })
      .addCase(archiveUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";

        if (action.payload?.page && action.payload?.users) {
          state.data[action.payload?.page] = action.payload?.users;
        }

        if (action.payload?.count && action.payload.count > state.totalCount) {
          state.totalCount = action.payload.count;
        }
      });
  },
});

export const {
  resetUsersData,
  setSelectedUserData,
  resetSelectedUser,
} = usersSlice.actions;

export const createUsersSelector =
  (page = 1) =>
  (state: RootState) =>
    state.users.data[page] || [];
export const selectUserData = (state: RootState) =>
  state.users.selectedUser;
export const selectUsersNumberOfPages = (state: RootState) =>
  Math.ceil(state.users.totalCount / LIMIT);
export const selectUsersLoadingStatus = (state: RootState) =>
  state.users.status;
export const selectUsersError = (state: RootState) =>
  state.users.error;

export default usersSlice.reducer;
