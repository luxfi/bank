import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import * as AccountsApi from "./AccountsApi";
import {
  AccountDataResponse,
  AccountResponse,
  ContactResponse,
  Conversion,
  SenderResponse,
  Transaction,
} from "./model/account-response";

export interface AccountsListState {
  status: "loading" | "idle" | "error";
  error: string;
  accounts: AccountResponse[];
  contacts: ContactResponse[];
  contact: ContactResponse;
  account_data: AccountDataResponse;
  account: AccountResponse;
  activeAccount: ActiveAccount;
  transactions: Transaction[];
  transaction: Transaction;
  conversion: Conversion;
  sender: SenderResponse;
  transaction_page: {
    pages: number;
    counts: number;
  };
}
export interface ActiveAccount {
  active_account_id: string;
  active_currency_code: string;
  active_currency_amount: string;
  active_id: string;
}
const initialActiveAccount = {
  active_account_id: "",
  active_currency_code: "",
  active_currency_amount: "",
  active_id: "",
};
const initialConversion = {
  id: "",
  settlement_date: "",
  conversion_date: "",
  short_reference: "",
  creator_contact_id: "",
  account_id: "",
  currency_pair: "",
  status: "",
  buy_currency: "",
  sell_currency: "",
  client_buy_amount: "",
  client_sell_amount: "",
  fixed_side: "",
  core_rate: "",
  partner_rate: "",
  partner_buy_amount: "",
  partner_sell_amount: "",
  client_rate: "",
  deposit_required: "",
  deposit_amount: "",
  deposit_currency: "",
  deposit_status: "",
  deposit_required_at: "",
  payment_ids: "",
  unallocated_funds: "",
  unique_request_id: "",
  created_at: "",
  mid_market_rate: "",
};

const initialAccount = {
  id: "",
  account_name: "",
  brand: "",
  your_reference: "",
  status: "",
  street: "",
  city: "",
  state_or_province: "",
  country: "",
  postal_code: "",
  spread_table: "",
  legal_entity_type: "",
  identification_type: "",
  identification_value: "",
  short_reference: "",
  api_trading: "",
  online_trading: "",
  phone_trading: "",
  process_third_party_funds: "",
  settlement_type: "",
  agent_or_reliance: "",
  terms_and_conditions_accepted: "",
  bank_account_verified: "",
  riskAssessments: [],
  entityType: "",
  createdAt: "",
  cloudCurrencyId: "",
  openPaydId: "",
  isApproved: false,
};
const initialContact = {
  login_id: "",
  id: "",
  first_name: "",
  last_name: "",
  account_id: "",
  account_name: "",
  status: "",
  locale: "",
  timezone: "",
  email_address: "",
  mobile_phone_number: "",
  phone_number: "",
  your_reference: "",
  date_of_birth: "",
};
const initialSender = {
  id: "",
  amount: "",
  currency: "",
  additional_information: "",
  value_date: "",
  sender: "",
  created_at: "",
};
const initialTransaction = {
  id: "",
  balance_id: "",
  account_id: "",
  currency: "",
  amount: "",
  balance_amount: null,
  type: "",
  related_entity_type: "",
  related_entity_id: "",
  related_entity_short_reference: "",
  status: "",
  reason: "",
  settles_at: "",
  created_at: "",
  completed_at: "",
  action: "",
};
const initialState: AccountsListState = {
  status: "idle",
  error: "",
  accounts: [],
  account: initialAccount,
  contacts: [],
  contact: initialContact,
  account_data: { funding_accounts: [], settlement_accounts: [] },
  activeAccount: initialActiveAccount,
  transactions: [],
  conversion: initialConversion,
  sender: initialSender,
  transaction: initialTransaction,
  transaction_page: {
    pages: 1,
    counts: 0,
  },
};

export const loadAccountsList = createAsyncThunk(
  "accountsList/load",
  async (_, thunkApi) => {
    thunkApi.getState();
    return AccountsApi.account_list();
  }
);

export const loadAccount = createAsyncThunk(
  "account/load",
  async (props: { account_id: string }, thunkApi) => {
    thunkApi.getState();
    return AccountsApi.getAccount(props.account_id);
  }
);
export const loadTransaction = createAsyncThunk(
  "transactionbycurrency/load",
  async (
    props: {
      account_id: string;
      currency: string;
      settles_at_from: string;
      completed_at_from: string;
      page: number;
    },
    thunkApi
  ) => {
    thunkApi.getState();
    return AccountsApi.getTransaction(
      props.currency,
      props.settles_at_from,
      props.completed_at_from,
      props.page
    );
  }
);
export const loadTransactionbyRef = createAsyncThunk(
  "transactionbyRef/load",
  async (props: { short_ref: string }, thunkApi) => {
    thunkApi.getState();
    return AccountsApi.getTransactionRef(props.short_ref);
  }
);
export const loadConversion = createAsyncThunk(
  "conversion/load",
  async (props: { uuid: string }, thunkApi) => {
    thunkApi.getState();
    return AccountsApi.getConversion(props.uuid);
  }
);
export const setCurrencyAccount = createAsyncThunk(
  "currencyAccount/set",
  async (props: { currency: string }, thunkApi) => {
    thunkApi.getState();
    return AccountsApi.createCurrencyAccount(props.currency);
  }
);
export const loadContactsList = createAsyncThunk(
  "contactList/load",
  async (props: { account_id: string }, thunkApi) => {
    thunkApi.getState();
    return AccountsApi.contact_list(props.account_id);
  }
);
export const loadContact = createAsyncThunk(
  "contact/load",
  async (props: { contact_id: string }, thunkApi) => {
    thunkApi.getState();
    return AccountsApi.getContact(props.contact_id);
  }
);
export const loadSender = createAsyncThunk(
  "sender/load",
  async (props: { entity_id: string }, thunkApi) => {
    thunkApi.getState();
    return AccountsApi.getSender(props.entity_id);
  }
);
export const loadSettleAccountList = createAsyncThunk(
  "settleAccountList/load",
  async (props: { currency: string; account_id: string }, thunkApi) => {
    thunkApi.getState();
    return AccountsApi.settle_account_list(props.currency, props.account_id);
  }
);
export const loadActiveAccount = createAsyncThunk(
  "account/current",
  async (_, thunkApi) => {
    thunkApi.getState();
    return AccountsApi.activeCurrentAccount();
  }
);
export const accountsListSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setActiveAccount: (
      state,
      action: PayloadAction<{
        id: string;
        account_id: string;
        account_currency: string;
        account_amount: string;
      }>
    ) => {
      state.activeAccount.active_id = action.payload.id;
      state.activeAccount.active_account_id = action.payload.account_id;
      state.activeAccount.active_currency_amount =
        action.payload.account_amount;
      state.activeAccount.active_currency_code =
        action.payload.account_currency;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAccountsList.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadAccountsList.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadAccountsList.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.accounts = action.payload;
      })
      .addCase(loadAccount.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadAccount.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadAccount.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.account = action.payload;
      })
      .addCase(loadTransaction.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadTransaction.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadTransaction.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.transactions = action.payload.transactions;
        state.transaction_page.pages = action.payload.pagination.total_pages;
        state.transaction_page.counts = action.payload.pagination.total_entries;
      })
      .addCase(loadTransactionbyRef.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadTransactionbyRef.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadTransactionbyRef.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.transaction = action.payload;
      })
      .addCase(loadSender.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadSender.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadSender.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.sender = action.payload;
      })
      .addCase(loadConversion.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadConversion.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadConversion.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.conversion = action.payload;
      })
      .addCase(loadActiveAccount.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadActiveAccount.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadActiveAccount.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.account = action.payload;
      })
      .addCase(loadContactsList.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadContactsList.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadContactsList.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.contacts = action.payload;
      })
      .addCase(loadContact.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadContact.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadContact.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.contact = action.payload;
      })
      .addCase(loadSettleAccountList.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadSettleAccountList.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadSettleAccountList.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.account_data = action.payload;
      });
  },
});

export const selectAccounts = (state: RootState) => state.accountsList.accounts;
export const selectAccount = (state: RootState) => state.accountsList.account;
export const selectContacts = (state: RootState) => state.accountsList.contacts;
export const selectContact = (state: RootState) => state.accountsList.contact;
export const selectSender = (state: RootState) => state.accountsList.sender;
export const selectActiveAccount = (state: RootState) =>
  state.accountsList.activeAccount;
export const selectSettleAccount = (state: RootState) =>
  state.accountsList.account_data;
export const selectTransaction = (state: RootState) =>
  state.accountsList.transactions;
export const selectTransactionPages = (state: RootState) =>
  state.accountsList.transaction_page;
export const selectTransactionRef = (state: RootState) =>
  state.accountsList.transaction;
export const selectConversion = (state: RootState) =>
  state.accountsList.conversion;

export const { setActiveAccount } = accountsListSlice.actions;
export default accountsListSlice.reducer;
