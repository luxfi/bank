import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../app/store";
import { PaymentResponse } from "../accounts/model/account-response";
import {
  createPaymentdata,
  deletePaymentdata,
  getBeneficiary,
  getDeliveryDate,
  getFeesdata,
  getPayer,
  getPayment,
  updatePaymentdata,
  validatePaymentdata,
} from "./ViewCurrencyApi";
export interface ViewPaymentFee {
  fee_amount: string;
  fee_currency: string;
}
export interface ViewPaymentState {
  status: "loading" | "idle" | "error";
  error: string;
  fees?: ViewPaymentFee[];
  // data: ViewPaymentData;
  currencyData: {
    currency: string;
    amount: string;
    beneficiary: string;
    account_id: string;
  };
  payerData: PayerInfo;
  payment: PaymentResponse;
  deliveryData: {
    payment_date: string | undefined;
    payment_delivery_date: string | undefined;
    payment_cutoff_time: string | undefined;
    payment_type: string | undefined;
    currency: string | undefined;
    bank_country: string | undefined;
  };
  payer: {
    legal_entity_type: string | undefined;
    company_name: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    address: string | undefined;
    city: string | undefined;
    state_or_province: string | undefined;
    country: string | undefined;
    postcode: string | undefined;
    date_of_birth: string | undefined;
    identification_type: string | undefined;
    identification_value: string | undefined;
    companyName: string | undefined;
    countryOfRegistration: string | undefined;
  };
  beneficiary: {
    id: string | undefined;
    bank_account_holder_name: string | undefined;
    name: string | undefined;
    email: string | undefined;
    payment_types: string | undefined;
    beneficiary_address: string | undefined;
    beneficiary_country: string | undefined;
    beneficiary_entity_type: string | undefined;
    beneficiary_company_name: string | undefined;
    beneficiary_first_name: string | undefined;
    beneficiary_last_name: string | undefined;
    beneficiary_city: string | undefined;
    beneficiary_postcode: string | undefined;
    beneficiary_state_or_province: string | undefined;
    beneficiary_date_of_birth: string | undefined;
    beneficiary_identification_type: string | undefined;
    beneficiary_identification_value: string | undefined;
    bank_country: string | undefined;
    bank_name: string | undefined;
    bank_account_type: string | undefined;
    currency: string | undefined;
    account_number: string | undefined;
    routing_code_type_1: string | undefined;
    routing_code_value_1: string | undefined;
    routing_code_type_2: string | undefined;
    routing_code_value_2: string | undefined;
    bic_swift: string | undefined;
    iban: string | undefined;
    default_beneficiary: string | undefined;
    creator_contact_id: string | undefined;
    bank_address: string | undefined;
    created_at: string | undefined;
    updated_at: string | undefined;
    beneficiary_external_reference: string | undefined;
  };
}

const initialState: ViewPaymentState = {
  status: "idle",
  fees: [],
  error: "",
  // data: initialViewPaymentData,
  currencyData: {
    currency: "",
    amount: "",
    beneficiary: "",
    account_id: "",
  },
  payerData: {
    payment_date: "",
    payment_type: "",
    pay_type: "",
    pay_reason: "",
    pay_reference: "",
    purpose_code: "",
    payer_type: "",
    payer_country: "",
    payer_company_name: "",
    payer_address: "",
    payer_city: "",
    payer_first_name: "",
    payer_last_name: "",
    payer_birth: "",
  },
  payment: {
    id: "",
    amount: "",
    beneficiary_id: "",
    currency: "",
    reference: "",
    reason: "",
    status: "",
    creator_contact_id: "",
    payment_type: "",
    payment_date: "",
    transferred_at: "",
    authorisation_steps_required: "",
    last_updater_contact_id: "",
    short_reference: "",
    conversion_id: "",
    failure_reason: "",
    payer_id: "",
    payer_details_source: "",
    payment_group_id: "",
    unique_request_id: "",
    failure_returned_amount: "",
    ultimate_beneficiary_name: "",
    purpose_code: "",
    charge_type: "",
    fee_amount: "",
    fee_currency: "",
    estimated_arrival: "",
    created_at: "",
    updated_at: "",
    error: {},
    related_entity_id: null,
    account_name: null,
    status_approval: "",
  },
  deliveryData: {
    payment_date: "",
    payment_delivery_date: "",
    payment_cutoff_time: "",
    payment_type: "",
    currency: "",
    bank_country: "",
  },
  payer: {
    legal_entity_type: "",
    company_name: "",
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state_or_province: "",
    country: "",
    postcode: "",
    date_of_birth: "",
    identification_type: "",
    identification_value: "",
    companyName: "",
    countryOfRegistration: "",
  },
  beneficiary: {
    id: "",
    bank_account_holder_name: "",
    name: "",
    email: "",
    payment_types: "",
    beneficiary_address: "",
    beneficiary_country: "",
    beneficiary_entity_type: "",
    beneficiary_company_name: "",
    beneficiary_first_name: "",
    beneficiary_last_name: "",
    beneficiary_city: "",
    beneficiary_postcode: "",
    beneficiary_state_or_province: "",
    beneficiary_date_of_birth: "",
    beneficiary_identification_type: "",
    beneficiary_identification_value: "",
    bank_country: "",
    bank_name: "",
    bank_account_type: "",
    currency: "",
    account_number: "",
    routing_code_type_1: "",
    routing_code_value_1: "",
    routing_code_type_2: "",
    routing_code_value_2: "",
    bic_swift: "",
    iban: "",
    default_beneficiary: "",
    creator_contact_id: "",
    bank_address: "",
    created_at: "",
    updated_at: "",
    beneficiary_external_reference: "",
  },
};

interface CurrencyInfo {
  currency: string;
  amount: string;
  beneficiary: string;
  account_id?: string;
}
interface PayerInfo {
  payment_date: string;
  payment_type: string;
  pay_type: string;
  pay_reason: string;
  pay_reference: string;
  purpose_code?: string;
  payer_country?: string;
  payer_type?: string;
  payer_company_name?: string;
  payer_address?: string;
  payer_city?: string;
  payer_first_name?: string;
  payer_last_name?: string;
  payer_birth?: string;
}
interface FeesInfo {
  account_id: string;
  currency: string;
  beneficiary_id: string;
  amount: string;
  payment_types: string[];
}
interface PayInfo {
  id?: string;
  currency: string;
  beneficiary_id: string;
  amount: string;
  reason: string;
  reference: string;
  payment_type: string;
  conversion_id?: string;
  payer_entity_type?: string;
  payer_company_name?: string;
  payer_first_name?: string;
  payer_last_name?: string;
  payer_city?: string;
  payer_address?: string;
  payer_country?: string;
  payer_date_of_birth?: string;
}
interface DeliveryInfo {
  payment_date: string;
  payment_type: string;
  currency: string;
  bank_country: string;
}

const initialPayment = {
  id: "",
  amount: "",
  beneficiary_id: "",
  currency: "",
  reference: "",
  reason: "",
  status: "",
  creator_contact_id: "",
  payment_type: "",
  payment_date: "",
  estimated_arrival: "",
  transferred_at: "",
  authorisation_steps_required: "",
  last_updater_contact_id: "",
  short_reference: "",
  conversion_id: null,
  failure_reason: "",
  payer_id: "",
  payer_details_source: "",
  created_at: "",
  updated_at: "",
  payment_group_id: null,
  unique_request_id: "",
  failure_returned_amount: "",
  ultimate_beneficiary_name: null,
  purpose_code: null,
  charge_type: null,
  fee_amount: null,
  fee_currency: null,
  error: {},
  related_entity_id: null,
  account_name: null,
  status_approval: "",
};

export const getDeliveryDateSlice = createAsyncThunk(
  "getDeliveryDate",
  async (data: DeliveryInfo, thunkApi) => {
    return getDeliveryDate(data);
  }
);
export const validatePaymentSlice = createAsyncThunk(
  "validatePayment",
  async (data: PayInfo, thunkApi) => {
    return validatePaymentdata(data);
  }
);
export const getFees = createAsyncThunk(
  "getFees",
  async (data: FeesInfo, thunkApi) => {
    return getFeesdata(data);
  }
);
export const createPayment = createAsyncThunk(
  "submitPayment",
  async (data: PayInfo, thunkApi) => {
    return createPaymentdata(data);
  }
);
export const editPayment = createAsyncThunk(
  "editPayment",
  async (data: PayInfo, thunkApi) => {
    return updatePaymentdata(data);
  }
);
export const loadBeneficiary = createAsyncThunk(
  "loadBeneficiary",
  async (props: { uuid: string }, thunkApi) => {
    return getBeneficiary(props.uuid);
  }
);
export const deletePayment = createAsyncThunk(
  "deletePayment",
  async (uuid: string, thunkApi) => {
    return deletePaymentdata(uuid);
  }
);
export const loadPayment = createAsyncThunk(
  "payment/load",
  async (props: { uuid: string }, thunkApi) => {
    thunkApi.getState();
    return getPayment(props.uuid);
  }
);
export const loadPayer = createAsyncThunk(
  "payer/load",
  async (uuid: string, thunkApi) => {
    return getPayer(uuid);
  }
);
export const viewPaymentSlice = createSlice({
  name: "viewPayment",
  initialState,
  reducers: {
    resetPayment: (state, action: PayloadAction<{}>) => {
      state.payment = initialPayment;
    },
    setCurrencyInfomation: (state, action: PayloadAction<CurrencyInfo>) => {
      state.currencyData.currency = action.payload.currency;
      state.currencyData.amount = action.payload.amount;
      state.currencyData.beneficiary = action.payload.beneficiary;
      if (action.payload.account_id) {
        state.currencyData.account_id = action.payload.account_id;
      }
    },
    setPayerInformation: (state, action: PayloadAction<PayerInfo>) => {
      state.payerData.payment_date = action.payload.payment_date;
      state.payerData.payment_type = action.payload.payment_type;
      state.payerData.pay_type = action.payload.pay_type;
      state.payerData.pay_reason = action.payload.pay_reason;
      state.payerData.pay_reference = action.payload.pay_reference;
      state.payerData.purpose_code = action.payload.purpose_code;
      state.payerData.payer_country = action.payload.payer_country;
      state.payerData.payer_type = action.payload.payer_type;
      state.payerData.payer_company_name = action.payload.payer_company_name;
      state.payerData.payer_address = action.payload.payer_address;
      state.payerData.payer_city = action.payload.payer_city;
      state.payerData.payer_first_name = action.payload.payer_first_name;
      state.payerData.payer_last_name = action.payload.payer_last_name;
      state.payerData.payer_birth = action.payload.payer_birth;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validatePaymentSlice.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(validatePaymentSlice.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't validate payment, please try again.`;
        }
      })
      .addCase(validatePaymentSlice.fulfilled, (state, action) => {
        // console.log('action validate', action.payload)
        state.status = "idle";
        state.error = "";

        // if (action.payload?.page && action.payload?.clients) {
        //   state.data[action.payload?.page] = action.payload?.clients;
        // }

        // if (action.payload?.count && action.payload.count > state.totalCount) {
        //   state.totalCount = action.payload.count;
        // }
      })
      .addCase(getDeliveryDateSlice.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(getDeliveryDateSlice.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't get delivery date of the payment, please try again.`;
        }
      })
      .addCase(getDeliveryDateSlice.fulfilled, (state, action) => {
        state.deliveryData = action.payload;
        state.status = "idle";
        state.error = "";
      })
      .addCase(loadPayer.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadPayer.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't get delivery date of the payment, please try again.`;
        }
      })
      .addCase(loadPayer.fulfilled, (state, action) => {
        state.payer = action.payload;
        state.status = "idle";
        state.error = "";
      })
      .addCase(loadBeneficiary.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadBeneficiary.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't get delivery date of the payment, please try again.`;
        }
      })
      .addCase(loadBeneficiary.fulfilled, (state, action) => {
        state.beneficiary = action.payload;
        state.status = "idle";
        state.error = "";
      })
      .addCase(createPayment.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't validate payment, please try again.`;
        }
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.payment = action.payload;
        if (action.payload.error) {
          state.error = action.payload.error.errorCode;
          state.status = "error";
        }
      })
      .addCase(getFees.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(getFees.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't validate payment, please try again.`;
        }
      })
      .addCase(getFees.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.fees = action.payload;
      })
      .addCase(loadPayment.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loadPayment.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Balances couldn't be loaded, please try again.";
        }
      })
      .addCase(loadPayment.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.payment = action.payload;
      })
      .addCase(editPayment.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(editPayment.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't validate payment, please try again.`;
        }
      })
      .addCase(editPayment.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.payment = action.payload;
      })
      .addCase(deletePayment.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't validate payment, please try again.`;
        }
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";

        // if (action.payload?.page && action.payload?.clients) {
        //   state.data[action.payload?.page] = action.payload?.clients;
        // }

        // if (action.payload?.count && action.payload.count > state.totalCount) {
        //   state.totalCount = action.payload.count;
        // }
        // state.payment = action.payload.id
      });
  },
});

export const { setCurrencyInfomation, setPayerInformation, resetPayment } =
  viewPaymentSlice.actions;
export const selectCurrencyInformation = (state: RootState) =>
  state.viewPayment.currencyData;
export const selectPayerInformation = (state: RootState) =>
  state.viewPayment.payerData;
export const deletePaymentAndReload =
  (uuid: string) => async (dispatch: AppDispatch) => {
    await dispatch(deletePayment(uuid)).unwrap();
  };
export const selectPaymentFees = (state: RootState) => state.viewPayment.fees;
export const selectPayment = (state: RootState) => state.viewPayment.payment;
export const selectPayer = (state: RootState) => state.viewPayment.payer;
export const selectDeliveryDate = (state: RootState) =>
  state.viewPayment.deliveryData;
export const selectBeneficiary = (state: RootState) =>
  state.viewPayment.beneficiary;
export default viewPaymentSlice.reducer;
