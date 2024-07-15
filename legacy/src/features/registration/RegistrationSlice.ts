import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AddressInformationMetadataDto } from "./model/addressInformationMetadataSchema";
import { addressMetadataInitialValues } from "./model/addressMetadataInitialValue";
import { AdminInvitationDto } from "./model/AdminInvitationDto";
import { AdvancedInformationMetadataDto } from "./model/advancedInformationMetadataSchema";
import { bankMetadataInitialValues } from "./model/bankMetadataInitialValues";
import { BankMetadataDto } from "./model/bankMetadataSchema";
import { businessMetadataInitialValues } from "./model/businessMetadataInitialValues";
import { BusinessMetadataDto } from "./model/businessMetadataSchema";
import { CompanyInformationMetadataDto } from "./model/companyInformationMetadataSchema";
import { CountrySlideDto } from "./model/countrySlideSchema";
import { ExpectedVolumeDto } from "./model/expectedVolumeSchema";
import { formInformationMetadataDto } from "./model/formInformationMetadataSchema";
import { formMetadataInitialValues } from "./model/formMetadataInitialValue";
import { createIndividualMetadataInitialValues } from "./model/individualMetadataInitialValues";
import { IndividualMetadataDto } from "./model/individualMetadataSchema";
import { UserMetadataDto } from "./model/UserMetadataDto";
import {
  CheckVerificationDto,
  CheckVerificationBasisDto,
  VerificationDto,
  register,
  submitUserMetadata as apiSubmitUserMetadata,
  resetPasswordFromAdminInvitation,
} from "./RegistrationApi";

export interface RegistrationState {
  status: "loading" | "idle" | "error";
  error: string;
  data: RegistrationData;
  metadata: UserMetadataDto;
}

export interface RegistrationData {
  firstname: string;
  lastname: string;
  email: string;
  entityType: EntityType;
  businessRole: string;
  country: string;
  mobileNumber: string;
  verificationCode: string;
  companyType: string;
  code: string;
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
  password: string;
  invitationUuid?: string;
  invitationCode?: string;
  company_name: string;
  trading_name: string;
  website_url: string;
  nature_of_business: string;
  company_registration_number: string;
  is_vat_registered: string;
  vat_number: string;
  is_public_trading: string;
  stock_market_location: string;
  stock_market: string;
  is_regulated: string;
  regulator_name: string;
}

interface BasicInfo {
  firstname: string;
  lastname: string;
  email: string;
}
interface CompanyInfo {
  company_name: string;
  trading_name: string;
  website_url: string;
  nature_of_business: string;
  company_registration_number: string;
  is_vat_registered: string;
  vat_number: string;
  is_public_trading: string;
  stock_market_location: string;
  stock_market: string;
  is_regulated: string;
  regulator_name: string;
}
export enum EntityType {
  Individual = "individual",
  Business = "business",
}

const initialRegistrationData = {
  firstname: "",
  lastname: "",
  email: "",
  entityType: EntityType.Individual,
  businessRole: "",
  country: "IM",
  mobileNumber: "",
  companyType: "LIMITED_LIABILITY",
  verificationCode: "",
  code: "",
  code1: "",
  code2: "",
  code3: "",
  code4: "",
  code5: "",
  code6: "",
  password: "",
  invitationUuid: "",
  invitationCode: "",
  company_name: "",
  trading_name: "",
  website_url: "",
  nature_of_business: "",
  company_registration_number: "",
  is_vat_registered: "Yes",
  vat_number: "",
  is_public_trading: "Yes",
  stock_market_location: "",
  stock_market: "",
  is_regulated: "Yes",
  regulator_name: "",
};

const initialUserMetadata: UserMetadataDto = {
  expectedValueOfTurnover: "",
  expectedVolumeOfTransactions: "",
  bankMetadata: bankMetadataInitialValues,
  addressInformationMetadata: addressMetadataInitialValues,
  formInformationMetadata: formMetadataInitialValues,
  individualMetadata: createIndividualMetadataInitialValues(null),
  businessMetadata: businessMetadataInitialValues
};

const initialState: RegistrationState = {
  status: "idle",
  error: "",
  data: initialRegistrationData,
  metadata: initialUserMetadata,
};

export const submitRegistrationData = createAsyncThunk(
  "registration/submitRegistrationData",
  async (_, thunkApi) => {
    const result = await register(
      selectRegistrationData(thunkApi.getState() as RootState)
    );
    if (result.user) {
      const user = result.user;
      if (user !== null) {
        return user;
      }
      throw new Error("Registration failed.");
    } else if (result.error) {
      throw new Error(result.error.message);
    } else throw new Error("Registration failed.");
  }
);

export const submitUserMetadata = createAsyncThunk(
  "registration/submitUserMetadata",
  async (_, thunkApi) => {
    return apiSubmitUserMetadata(
      selectRegistrationMetadata(thunkApi.getState() as RootState)
    );
  }
);

export const submitInvitationFromAdmin = createAsyncThunk(
  "registration/admin/invitation",
  async(data: AdminInvitationDto, thunkApi) => {
    const result = await resetPasswordFromAdminInvitation(data);
    return result;
  }
)

export const registrationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInvitationInfo(
      state,
      action: PayloadAction<{ uuid: string; code: string }>
    ) {
      state.data.invitationUuid = action.payload.uuid;
      state.data.invitationCode = action.payload.code;
    },
    setBasicInfo: (state, action: PayloadAction<BasicInfo>) => {
      state.data.firstname = action.payload.firstname;
      state.data.lastname = action.payload.lastname;
      state.data.email = action.payload.email;
    },
    setAdvancedInfo: (
      state,
      action: PayloadAction<AdvancedInformationMetadataDto>
    ) => {
      // state.data.firstname = action.payload.firstname;
      // state.data.lastname =action.payload.lastname;
      // state.data.title = action.payload.title;
      // state.data.formername = action.payload.formername;
      // state.data.othername = action.payload.othername;
      // state.data.birth = action.payload.birth;
      // state.data.place = action.payload.place;
      // state.metadata.advancedInformationMetadata = action.payload;
      state.metadata.individualMetadata.firstname = action.payload.firstname;
      state.metadata.individualMetadata.lastname = action.payload.lastname;
      state.metadata.individualMetadata.title = action.payload.title;
      state.metadata.individualMetadata.formerName = action.payload.formername;
      state.metadata.individualMetadata.otherName = action.payload.otherName;
      state.metadata.individualMetadata.dateOfBirth = action.payload.birth;
      state.metadata.individualMetadata.placeOfBirth = action.payload.place;
    },
    setAddressInfo: (
      state,
      action: PayloadAction<AddressInformationMetadataDto>
    ) => {
      state.metadata.individualMetadata.addressLine1 = action.payload.line11;
      state.metadata.individualMetadata.addressLine2 = action.payload.line12;
      state.metadata.individualMetadata.previousAddressLine1 =
        action.payload.line21;
      state.metadata.individualMetadata.previousAddressLine2 =
        action.payload.line22;
      state.metadata.individualMetadata.city = action.payload.city1;
      state.metadata.individualMetadata.previousCity = action.payload.city2;
      state.metadata.individualMetadata.state = action.payload.state1;
      state.metadata.individualMetadata.previousState = action.payload.state2;
      state.metadata.individualMetadata.postcode = action.payload.codePost1;
      state.metadata.individualMetadata.previousPostcode =
        action.payload.codePost2;
      state.metadata.individualMetadata.country = action.payload.country1;
      state.metadata.individualMetadata.previousCountry =
        action.payload.country2;
    },
    setCompanyInfo: (
      state,
      action: PayloadAction<CompanyInformationMetadataDto>
    ) => {
      state.metadata.businessMetadata.registeredOffice1 = action.payload.address1;
      state.metadata.businessMetadata.registeredOffice1_address2 = action.payload.address2;
      state.metadata.businessMetadata.registeredOffice1_city = action.payload.city;
      state.metadata.businessMetadata.registeredOffice1_postcode = action.payload.postcode;
      state.metadata.businessMetadata.registeredOffice1_state = action.payload.state;
      state.metadata.businessMetadata.companyName =
        action.payload.company_name;
      state.metadata.businessMetadata.tradingName =
        action.payload.trading_name;
      state.metadata.businessMetadata.websiteUrl = action.payload.website_url;
      state.metadata.businessMetadata.natureOfBusiness =
        action.payload.nature_of_business;
      state.metadata.businessMetadata.companyRegistrationNumber =
        action.payload.company_registration_number;
      state.metadata.businessMetadata.isVatRegistered =
        action.payload.is_vat_registered === "Yes";
      state.metadata.businessMetadata.vatNumber = action.payload.vat_number;
      state.metadata.businessMetadata.isPubliclyTrading =
        action.payload.is_public_trading === 'Yes';
      state.metadata.businessMetadata.stockMarketLocation =
        action.payload.stock_market_location;
      state.metadata.businessMetadata.stockMarket =
        action.payload.stock_market;
      state.metadata.businessMetadata.isRegulated =
        action.payload.is_regulated === "Yes";
      state.metadata.businessMetadata.regulatorName =
        action.payload.regulator_name;
    },
    setFormInfo: (state, action: PayloadAction<formInformationMetadataDto>) => {
      state.metadata.individualMetadata.gender = action.payload.gender;
      state.metadata.individualMetadata.identificationType =
        action.payload.identificationType;
      state.metadata.individualMetadata.identificationNumber =
        action.payload.identifyNumber;
      state.metadata.individualMetadata.employerName = action.payload.employerName;
      state.metadata.individualMetadata.employerAddress1 = action.payload.employerAddress1;
      state.metadata.individualMetadata.occupation = action.payload.occupation;
      state.metadata.individualMetadata.nationality = action.payload.nationality;
    },
    setBankInfo: (state, action: PayloadAction<BankMetadataDto>) => {
      if (state.metadata.bankMetadata) {
        state.metadata.bankMetadata.IBAN = action.payload.IBAN;
        state.metadata.bankMetadata.bicSwift = action.payload.bicSwift;
        state.metadata.bankMetadata.accountHolderName = action.payload.accountHolderName;
        state.metadata.bankMetadata.accountNumber =  action.payload.accountNumber;
        state.metadata.bankMetadata.bankCountry = action.payload.bankCountry;
        state.metadata.bankMetadata.bankName = action.payload.bankName;
        state.metadata.bankMetadata.branch = action.payload.branch;
        state.metadata.bankMetadata.sortCode = action.payload.sortCode;
        state.metadata.bankMetadata.currency = action.payload.currency;
      }
    },
    unSetBankInfo: (state) => {
      const temp = state.metadata;
      delete temp.bankMetadata;
      state.metadata = temp;
    },
    setEntityType: (state, action: PayloadAction<EntityType>) => {
      state.data.entityType = action.payload;
    },
    setCountrySlideInfo: (state, action: PayloadAction<CountrySlideDto>) => {
      state.data.country = String(action.payload.country);

      if (state.data.entityType === EntityType.Business) {
        const businessRoleSelect = String(action.payload.businessRoleSelect);
        const businessRole = String(action.payload.businessRole);
        state.data.companyType = String(action.payload.companyType);
        if (businessRoleSelect === "other") {
          state.data.businessRole = businessRole;
        } else {
          state.data.businessRole = businessRoleSelect;
        }
      }
    },
    setMobileBasisData: (
      state,
      action: PayloadAction<CheckVerificationBasisDto>
    ) => {
      state.data.mobileNumber = String(action.payload.mobileNumber);
      state.data.code1 = String(action.payload.code1);
      state.data.code2 = String(action.payload.code2);
      state.data.code3 = String(action.payload.code3);
      state.data.code4 = String(action.payload.code4);
      state.data.code5 = String(action.payload.code5);
      state.data.code6 = String(action.payload.code6);
    },
    setMobileData: (state, action: PayloadAction<CheckVerificationDto>) => {
      state.data.mobileNumber = String(action.payload.mobileNumber);
      state.data.verificationCode = String(action.payload.verificationCode);
    },
    setMobileNumberData: (state, action: PayloadAction<VerificationDto>) => {
      state.data.mobileNumber = String(action.payload.mobileNumber);
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.data.password = action.payload;
    },
    setBankMetadata: (state, action: PayloadAction<BankMetadataDto>) => {
      state.metadata.bankMetadata = action.payload;
    },
    setIndividualMetadata: (
      state,
      action: PayloadAction<IndividualMetadataDto>
    ) => {
      state.metadata.individualMetadata = action.payload;
    },
    setBusinessMetadata: (
      state,
      action: PayloadAction<BusinessMetadataDto>
    ) => {
      state.metadata.businessMetadata = action.payload;
    },
    setExpectedVolumeMetadata: (
      state,
      action: PayloadAction<ExpectedVolumeDto>
    ) => {
      state.metadata.expectedValueOfTurnover = String(
        action.payload.expectedValueOfTurnover
      );
      state.metadata.expectedVolumeOfTransactions = String(
        action.payload.expectedVolumeOfTransactions
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitUserMetadata.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitUserMetadata.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Submission failed, please try again.";
        }
      })
      .addCase(submitUserMetadata.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        //state.metadata = action.payload;
      })
      .addCase(submitRegistrationData.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(submitRegistrationData.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = '';
      })
      .addCase(submitRegistrationData.rejected, (state, action) => {
        state.error = 'Something went wrong.';
        state.status = 'error';
      })
      ;
  },
});

export const selectRegistrationBasicInfo = (state: RootState): BasicInfo => ({
  firstname: state.registration.data.firstname,
  lastname: state.registration.data.lastname,
  email: state.registration.data.email,
});
export const selectRegistrationCountrySlideInfo = (state: RootState) => {
  return {
    country: state.registration.data.country,
    businessRole: state.registration.data.businessRole,
  };
};
export const selectRegistrationType = (state: RootState) =>
  state.registration.data.entityType;
export const selectRegistrationCountry = (state: RootState) =>
  state.registration.data.country;
export const selectRegistrationData = (state: RootState) =>
  state.registration.data;
export const selectRegistrationMetadata = (state: RootState) =>
  state.registration.metadata;
export const selectRegistrationError = (state: RootState) =>
  state.registration.error;
export const selectRegistrationStatus = (state: RootState) =>
  state.registration.status;
export const selectRegistrationMobileNumber = (state: RootState) =>
  state.registration.data.mobileNumber;
export const selectRegistrationMobileCode = (state: RootState) =>
  state.registration.data.code;
export const selectCode1 = (state: RootState) => state.registration.data.code1;
export const {
  setInvitationInfo,
  setBasicInfo,
  setAdvancedInfo,
  setAddressInfo,
  setCompanyInfo,
  setFormInfo,
  setBankInfo,
  unSetBankInfo,
  setEntityType,
  setCountrySlideInfo,
  setMobileData,
  setMobileNumberData,
  setPassword,
  setBankMetadata,
  setBusinessMetadata,
  setIndividualMetadata,
  setExpectedVolumeMetadata,
  setMobileBasisData,
} = registrationSlice.actions;

export default registrationSlice.reducer;
