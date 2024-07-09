import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { AppThunk, RootState } from "../../app/store";
import Constants from "../../Constants";
import * as AuthApi from "./AuthApi";

type LoadingStatus = "loading" | "idle" | "error";

export interface AuthenticationState {
  currentUser: AuthApi.User | null;
  userTempData: AuthApi.User | null;
  status: LoadingStatus;
  error: string | null;
  shouldOpenCreatePassword: boolean;
  shouldOpen2FA: boolean;
}

const initialState: AuthenticationState = {
  currentUser: null,
  userTempData: null,
  status: "loading",
  error: null,
  shouldOpenCreatePassword: false,
  shouldOpen2FA: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: AuthApi.LoginDto, thunkApi) => {
    const user: AuthApi.User = await AuthApi.login(data);

    return user;
  }
);

export const login2FA = createAsyncThunk(
  "auth/login2FA",
  async (data: AuthApi.Check2FAVerificationDto, thunkApi) => {
    const user: AuthApi.User | boolean | string = await AuthApi.login2FA(data);

    return user;
  }
);

export const resendCode = createAsyncThunk(
  "auth/resend2faCode",
  async (provider: "sms" | "email", thunkApi) => {
    return await AuthApi.resend2faCode(provider);
  }
);

export const changeClient = createAsyncThunk(
  "user/changeCurrentClient",
  async (uuid: string, thunkApi) => {
    const user: AuthApi.User = await AuthApi.changeCurrentClient(uuid);

    return user;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await AuthApi.logout();
});

export const forgotPassword = createAsyncThunk(
  "users/forgot-password",
  async (data: AuthApi.ForgotPasswordData, thunkApi) => {
    await AuthApi.forgotPassword(data);
    return true;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    cancel2FAScreen: (state) => {
      state.shouldOpen2FA = false;
    },
    setCurrentUser: (state, action: PayloadAction<AuthApi.User>) => {
      state.status = "idle";
      state.error = null;
      state.currentUser = action.payload;
    },
    setUserTempData: (state, action: PayloadAction<AuthApi.User>) => {
      state.status = "idle";
      state.error = null;
      state.currentUser = action.payload;
    },
    setLoading: (state, action: PayloadAction<LoadingStatus>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.currentUser = null;
      })
      .addCase(login.rejected, (state, action) => {
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error =
            "Login failed, please check your username and password.";
        }

        state.status = "error";
        state.currentUser = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.userTempData = action.payload;
        if (state.userTempData.contact?.account?.cloudCurrencyId) {
          window.localStorage.setItem("gateway", "currencycloud");
        } else if (state.userTempData.contact?.account?.openPaydId) {
          window.localStorage.setItem("gateway", "openpayd");
        } else {
          window.localStorage.setItem("gateway", "");
        }
        if (!state.userTempData.hasAcceptedTerms) {
          state.shouldOpenCreatePassword = true;
        }
        state.shouldOpen2FA = true;
      })
      .addCase(login2FA.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        if (typeof action.payload == "object") {
          state.currentUser = action.payload;
          state.userTempData = null;
          if (state.currentUser.contact?.account?.cloudCurrencyId) {
            window.localStorage.setItem("gateway", "currencycloud");
          } else if (state.currentUser.contact?.account?.openPaydId) {
            window.localStorage.setItem("gateway", "openpayd");
          } else {
            window.localStorage.setItem("gateway", "");
          }
          state.shouldOpen2FA = false;
        }
      })
      .addCase(changeClient.rejected, (state, action) => {
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Could not load client, please try again";
        }
        state.status = "error";
      })
      .addCase(changeClient.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        if (typeof action.payload == "object") {
          state.currentUser = action.payload;
          if (state.currentUser.contact?.account?.cloudCurrencyId) {
            window.localStorage.setItem("gateway", "currencycloud");
          } else if (state.currentUser.contact?.account?.openPaydId) {
            window.localStorage.setItem("gateway", "openpayd");
          } else {
            window.localStorage.setItem("gateway", "");
          }
        }
      })
      .addCase(resendCode.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.error = null;
        state.currentUser = null;
        window.location.href = "/login/";
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "idle";
        state.error = "";
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.status = "error";
        state.error = "Something went wrong. Please try again.";
      });
  },
});

export const checkAuth = (): AppThunk => (dispatch, getState) => {
  dispatch(setLoading("loading"));

  const currentUser = selectCurrentUser(getState());
  if (currentUser) {
    dispatch(setLoading("idle"));
    return;
  }

  if (!Cookies.get(Constants.JWT_COOKIE_NAME)) {
    dispatch(setLoading("idle"));
    return;
  }

  AuthApi.getCurrentUser()
    .then((user) => {
      if (user) {
        dispatch(setCurrentUser(user));
      }
    })
    .finally(() => {
      dispatch(setLoading("idle"));
    });
};

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectuserTempData = (state: RootState) => state.auth.userTempData;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectShouldOpenCreatePassword = (state: RootState) =>
  state.auth.shouldOpenCreatePassword;
export const selectShouldOpen2FA = (state: RootState) =>
  state.auth.shouldOpen2FA;
export const { setCurrentUser, setLoading, cancel2FAScreen } =
  authSlice.actions;

export default authSlice.reducer;
