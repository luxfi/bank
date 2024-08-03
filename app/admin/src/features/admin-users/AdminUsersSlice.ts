import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User } from "../auth/AuthApi";
import * as AdminUsersApi from "./AdminUsersApi";
import { AdminUserDto, initialAdminUserData } from "./model/adminUserSchema";

const LIMIT = 20;

export interface AdminUsersState {
  status: "loading" | "idle" | "error";
  error: string;
  data: Record<string, User[]>;
  totalCount: number;
  selectedUser: AdminUserDto;
}

const initialState: AdminUsersState = {
  status: "idle",
  error: "",
  data: {},
  selectedUser: initialAdminUserData,
  totalCount: 0,
};

export const submitAdminUser = createAsyncThunk(
  "admin-users/submit",
  async (props: { uuid: string }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const data = selectAdminUserData(state);
    if (props.uuid === "new") {
      return AdminUsersApi.createUser(data);
    } else {
      return AdminUsersApi.updateUser(props.uuid, data);
    }
  }
);

export const listAdminUsers = createAsyncThunk(
  "admin-users/list",
  async (props: { page: number }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const currentUsers = createAdminUsersSelector(props.page)(state);
    if (Array.isArray(currentUsers) && currentUsers.length > 0) {
      return null;
    }

    const { count, users } = await AdminUsersApi.getAdminUsers(props.page);
    return { page: props.page, count, users };
  }
);

export const fetchAdminUser = createAsyncThunk(
  "admin-users/fetch",
  async (props: { uuid: string }, thunkApi) => {
    const user = await AdminUsersApi.getAdminUser(props.uuid);
    return user;
  }
);

export const archiveAdminUsers = createAsyncThunk(
  "admin-users/archive",
  async (uuid: string, thunkApi) => {
    const user = await AdminUsersApi.archiveUser(uuid);
    return user;
  }
);

export const adminUsersSlice = createSlice({
  name: "admin-users",
  initialState,
  reducers: {
    resetAdminUsersData: (state) => {
      state.status = "idle";
      state.error = "";
      state.data = {};
    },
    setSelectedAdminUserData: (state, action: PayloadAction<AdminUserDto>) => {
      state.selectedUser = action.payload;
    },
    resetSelectedAdminUser: (state) => {
      state.status = "idle";
      state.error = "";
      state.selectedUser = initialAdminUserData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listAdminUsers.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(listAdminUsers.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't fetch the users, please try again.`;
        }
      })
      .addCase(listAdminUsers.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";

        if (action.payload?.page && action.payload?.users) {
          state.data[action.payload?.page] = action.payload?.users;
        }

        if (action.payload?.count && action.payload.count > state.totalCount) {
          state.totalCount = action.payload.count;
        }
      })

      .addCase(fetchAdminUser.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchAdminUser.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't fetch the user, please try again.`;
        }
      })
      .addCase(fetchAdminUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";

        state.selectedUser = {
          firstname: action.payload.firstname,
          lastname: action.payload.lastname,
          email: action.payload.username,
          country: action.payload.country,
          password: "",
          confirmPassword: "",
          uuid: action.payload.uuid,
          role: "",
          mobileNumber: action.payload.mobileNumber,
        };
      })

      .addCase(submitAdminUser.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitAdminUser.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't submit the user, please try again.`;
        }
      })
      .addCase(submitAdminUser.fulfilled, (state) => {
        state.status = "idle";
        state.error = "";
        state.selectedUser = initialAdminUserData;
      })

      .addCase(archiveAdminUsers.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(archiveAdminUsers.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't archive the user, please try again.`;
        }
      })
      .addCase(archiveAdminUsers.fulfilled, (state, action) => {
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
  resetAdminUsersData,
  setSelectedAdminUserData,
  resetSelectedAdminUser,
} = adminUsersSlice.actions;

export const createAdminUsersSelector =
  (page = 1) =>
  (state: RootState) =>
    state.adminUsers.data[page] || [];
export const selectAdminUserData = (state: RootState) =>
  state.adminUsers.selectedUser;
export const selectAdminUsersNumberOfPages = (state: RootState) =>
  Math.ceil(state.adminUsers.totalCount / LIMIT);
export const selectAdminUsersLoadingStatus = (state: RootState) =>
  state.adminUsers.status;
export const selectAdminUsersError = (state: RootState) =>
  state.adminUsers.error;

export default adminUsersSlice.reducer;
