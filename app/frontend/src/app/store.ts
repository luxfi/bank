import {
  Action,
  ThunkAction,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import accountsListReducer from "../features/accounts/AccountsListSlice";
import viewCurrencyReducer from "../features/accountview/ViewCurrencySlice";
import viewPaymentDetailSlice from "../features/accountview/ViewPaymentDetailSlice";
import viewPaymentReducer from "../features/accountview/ViewPaymentSlice";
import viewPercent from "../features/accountview/ViewPercentSlice";
import adminClientsReducer from "../features/admin-clients/AdminClientsSlice";
import archivedUsersReducer from "../features/admin-clients/ArchivedUsersSlice";
import adminUsersReducer from "../features/admin-users/AdminUsersSlice";
import authReducer from "../features/auth/AuthSlice";
import viewCarouselReducer from "../features/auth/ViewCarouselSlice";
import balancesListReducer from "../features/balances/BalancesListSlice";
import beneficiariesListReducer from "../features/beneficiaries/BeneficiariesListSlice";
import beneficiariesReducer from "../features/beneficiaries/BeneficiariesSlice";
import dashboardReducer from "../features/dashboard/DashboardSlice";
import documentsReducer from "../features/documents/DocumentsSlice";
import invitationReducer from "../features/invitation/UserInvitationSlice";
import profileReducer from "../features/profile/ProfileSlice";
import registrationReducer from "../features/registration/RegistrationSlice";
import requestRegistrationReducer from "../features/requestRegistration/RequestRegistrationSlice";
import searchReducer from "../features/search/SearchSlice";
import pendingReducer from "../features/pending/PendingSlice";
import usersReducer from "../features/users/UsersSlice";
import { ConvertUserMiddleware } from "./middleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registration: registrationReducer,
    requestRegistration: requestRegistrationReducer,
    profile: profileReducer,
    invitation: invitationReducer,
    beneficiaries: beneficiariesReducer,
    beneficiariesList: beneficiariesListReducer,
    userDocuments: documentsReducer,
    adminUsers: adminUsersReducer,
    users: usersReducer,
    adminClients: adminClientsReducer,
    viewCarousel: viewCarouselReducer,
    viewPayment: viewPaymentReducer,
    viewCurrency: viewCurrencyReducer,
    viewPercent: viewPercent,
    viewPaymentDetail: viewPaymentDetailSlice,
    balancesList: balancesListReducer,
    accountsList: accountsListReducer,
    dashboard: dashboardReducer,
    search: searchReducer,
    pending: pendingReducer,
    archivedUsers: archivedUsersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ConvertUserMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
