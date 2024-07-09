import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AdminClientDto, initialAdminClientData } from '../admin-clients/model/adminClientSchema';
import { bankMetadataInitialValues } from '../registration/model/bankMetadataInitialValues';
import { BankMetadataDto } from '../registration/model/bankMetadataSchema';
import { BrokerDto } from '../registration/model/brokerSchema';
import { businessMetadataInitialValues } from '../registration/model/businessMetadataInitialValues';
import { BusinessMetadataDto } from '../registration/model/businessMetadataSchema';
import { DirectorDto } from '../registration/model/directorSchema';
import { IndividualMetadataDto } from '../registration/model/individualMetadataSchema';
import { RiskAssessmentDto } from '../registration/model/riskAssessmentSchema';
import { ShareholderDto } from '../registration/model/shareholderSchema';
import { createIndividualMetadataInitialValues } from "../registration/model/individualMetadataInitialValues";
import * as ProfileApi from './ProfileApi';
import { EntityType } from '../registration/RegistrationSlice';
import { PendingMetadataDto } from '../registration/model/pendingMetadataDto';

export interface ProfileState {
    status: 'loading' | 'idle' | 'error';
    error: string;
    resetPasswordData: ResetPasswordData,
    userData: AdminClientDto;
    individualMetadata: IndividualMetadataDto;
    pendingMetadata: PendingMetadataDto[];
    businessMetadata: BusinessMetadataDto;
    bankMetadata: BankMetadataDto;
    // riskAssessment: RiskAssessmentDto;
    // riskAssessments: RiskAssessmentDto[] | [];
    expectedVolumeOfTransactions: string;
    expectedValueOfTurnover: string;
    // brokers: BrokerDto[] | [];
    // directors: DirectorDto[] | [];
    // shareholders: ShareholderDto[] | [];
    // linkedUsers: any[];
    // accountUuid: string;
    // complyLaunchSearchResult: any[];
    // // selectedClientDocuments: clientDocumentDto[] | [];
    // documents: any[];
}

export interface ResetPasswordData {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

const initialResetPasswordData = {
  currentPassword: '',
  password: '',
  confirmPassword: ''
};

const initialState: ProfileState = {
    status: 'idle',
    error: '',
    resetPasswordData: initialResetPasswordData,
    userData: initialAdminClientData,
    individualMetadata: createIndividualMetadataInitialValues(null),
    businessMetadata: businessMetadataInitialValues,
    bankMetadata: bankMetadataInitialValues,
    expectedValueOfTurnover: "",
    expectedVolumeOfTransactions: "",
    pendingMetadata: [],
    // brokers: [],
    // directors: [],
    // shareholders: [],
    // linkedUsers: [],
    // accountUuid: "",
    // complyLaunchSearchResult: [],
    // documents: [],
};

export const submitResetPasswordData = createAsyncThunk(
  'auth/resetPasswordStatus',
  async (_, thunkApi) => {
    const user = await ProfileApi.resetPassword(selectResetPasswordData(thunkApi.getState() as RootState));
    if (user !== null) {
      return user;
    }

    throw new Error('Reset Password failed for some reason.');
  }
)
export const fetchProfile = createAsyncThunk(
  "user-profile/fetch",
  async (props: { uuid: string }, thunkApi) => {
    const user = await ProfileApi.getProfile(props.uuid);
    return user;
  }
);
export const submitUser = createAsyncThunk(
  "user-profile/submit",
  async (props: { uuid: string }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const data = selectUserData(state);
    return ProfileApi.updateUser(props.uuid, data);
  }
);
export const submitMetadata = createAsyncThunk(
  "user-profile/submit-metadata",
  async (props: { uuid: string; entityType: EntityType }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const result = await ProfileApi.updateMetadata(props.uuid,  props.entityType === EntityType.Individual ? {
      individualMetadata: selectIndividualMetadata(state),
    } : {
      businessMetadata: selectBusinessMetadata(state),
    }).then((r) => r).catch((r) => {
      return thunkApi.rejectWithValue(r);
    });
    return result;
  }
);

export const submitBankMetadata = createAsyncThunk(
  "user-profile/submit-bank-metadata",
  async (
    props: { uuid: string; entityType: EntityType; partial?: boolean },
    thunkApi
  ) => {
    const state = thunkApi.getState() as RootState;
    const spending = selectExpectedSpending(state);
    const result =  await ProfileApi.updateMetadata(props.uuid, {
      bankMetadata: selectBankMetadata(state),
      expectedVolumeOfTransactions: spending.expectedVolumeOfTransactions,
      expectedValueOfTurnover: spending.expectedValueOfTurnover,
      partial: true,
    }).then((r) => r).catch((r) => {
      return thunkApi.rejectWithValue(r);
    });
    return result;
  }
);
export const submitSpendingData = createAsyncThunk(
  "user-profile/spending",
  async (props: { uuid: string; entityType: EntityType }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const spending = selectExpectedSpending(state);
    const result =  await ProfileApi.updateMetadata(props.uuid, {
      businessMetadata: selectBusinessMetadata(state),
      expectedVolumeOfTransactions: spending.expectedVolumeOfTransactions,
      expectedValueOfTurnover: spending.expectedValueOfTurnover,
      partial: true,
    }).then((r) => r).catch((r) => {
      return thunkApi.rejectWithValue(r);
    });
    return result;
  }
);

export const profileSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setResetPasswordInfo(state, action: PayloadAction<ResetPasswordData>) {
        state.resetPasswordData.currentPassword = action.payload.currentPassword;
        state.resetPasswordData.password = action.payload.password;
        state.resetPasswordData.confirmPassword = action.payload.confirmPassword;
    },
    resetUserData: (state) => {
      state.userData = initialAdminClientData;
    },
    setUserData: (state, action: PayloadAction<any>) => {
      state.userData = {
        ...state.userData,
        ...action.payload,
      };

      if (action.payload.entityType === EntityType.Business) {
        const businessRoleSelect = String(action.payload.businessRoleSelect);
        const businessRole = String(action.payload.businessRole);
        // const businessType = String(action.payload.companyType);
        state.userData.companyType = String(
          action.payload.companyType
        );
        if (businessRoleSelect === "other") {
          state.userData.businessRole = businessRole;
        } else {
          state.userData.businessRole = businessRoleSelect;
        }
      }
    },
    setIndividualMetaData: (state, action: PayloadAction<any>) => {
      const metaData = state.individualMetadata;
      state.individualMetadata = {
        ...metaData,
        ...action.payload,
      };
    },
    setBusinessMetaData: (state, action: PayloadAction<any>) => {
      const metaData = state.businessMetadata;
      state.businessMetadata = { ...metaData, ...action.payload };
    },
    setBankMetadata: (state, action: PayloadAction<any>) => {
      const bankData = state.bankMetadata;
      state.bankMetadata = { ...bankData, ...action.payload };
    },
    setSpending: (state, action: PayloadAction<any>) => {
      state.expectedValueOfTurnover =
        action.payload.expectedValueOfTurnover;
      state.expectedVolumeOfTransactions =
        action.payload.expectedVolumeOfTransactions;
    },
    /*
    setDocuments: (state, action: PayloadAction<any>) => {
      const oldDocuments = state.documents;
      let newDocuments: any[] = [];
      oldDocuments.map(document => {
        if (document.uuid == action.payload.uuid) {
          let tempDocument = action.payload;
          tempDocument.document = document.document;
          newDocuments.push(tempDocument);
        }
        else 
          newDocuments.push(document);
      });
      state.documents = newDocuments;
    }
    */
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitResetPasswordData.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(submitResetPasswordData.rejected, (state, action) => {
        state.status = 'error';
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = 'Submission failed, please try again.';
        }
      })
      .addCase(submitResetPasswordData.fulfilled, (state) => {
        state.status = 'idle';
        state.error = '';
        state.resetPasswordData = initialResetPasswordData;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't fetch the user, please try again.`;
        }
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        const client: any = action.payload;
        const businessRole = client.contact?.businessRole || initialAdminClientData.businessRole;
        state.userData = {
          contact: client.contact,
          firstname: client.firstname,
          lastname: client.lastname,
          email: client.username,
          cloudCurrencyId: client.contact?.cloudCurrencyId,
          entityType:
            client.contact?.account?.entityType ||
            initialAdminClientData.entityType,
          country: client.contact?.country || initialAdminClientData.country,
          mobileNumber:
            client.contact?.mobileNumber || initialAdminClientData.mobileNumber,
          businessRoleSelect:
            businessRole === initialAdminClientData ? businessRole : "other",
          businessRole,
          password: "",
          confirmPassword: "",
          verifiedAt: client.verifiedAt,
          companyType: client.contact?.account?.businessMetadata?.companyType,
          skipWelcomeEmail: 'yes',
          complyLaunchId: "",
        };

        state.individualMetadata =
          client.contact?.account?.individualMetadata ||
          createIndividualMetadataInitialValues(client);
        state.businessMetadata =
          client.contact?.account?.businessMetadata ||
          businessMetadataInitialValues;
        state.expectedValueOfTurnover =
          client.contact?.expectedValueOfTurnover;
        state.expectedVolumeOfTransactions =
          client.contact?.expectedVolumeOfTransactions;
        state.bankMetadata =
          client.contact?.account?.bankMetadata || bankMetadataInitialValues;
        state.pendingMetadata = client.contact?.account?.pendingMetadatas;
        // state.brokers = client.contact?.account?.brokers.sort((a:BrokerDto,b:BrokerDto)=>{
        //   return new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime();
        // }) || [];
        // state.directors =
        //   client.contact?.account?.directors.sort((a:DirectorDto,b:DirectorDto)=>{
        //     return new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime();
        //   }) || [];
        // state.shareholders =
        //   client.contact?.account?.shareholders.sort((a:ShareholderDto,b:ShareholderDto)=>{
        //     return new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime();
        //   }) || [];
        // let linkedUsers: any[] = [];
        // const contacts = client.contact?.account?.contact;
        // contacts?.forEach((contact: any) => {
        //   if (contact.isSubAccount) linkedUsers.push(contact.user);
        // });
        // state.linkedUsers = linkedUsers;
        // state.accountUuid = client.contact?.account?.uuid;
        // state.documents = client.documents;
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
        // state.selectedClientUserData = initialAdminClientData;
      })

      .addCase(submitMetadata.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitMetadata.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't update the metadata, please try again.`;
        }
      })
      .addCase(submitMetadata.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.individualMetadata = action.payload.contact?.account.individualMetadata;
        state.businessMetadata = action.payload.contact?.account?.businessMetadata;
        state.pendingMetadata = action.payload.contact?.account?.pendingMetadatas;
      })

      .addCase(submitBankMetadata.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitBankMetadata.rejected, (state, action) => {
        state.status = "error";
        state.error = `Couldn't update the metadata, please try again.`;
      })
      .addCase(submitBankMetadata.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.bankMetadata = action.payload.contact?.account?.bankMetadata;
        state.pendingMetadata = action.payload.contact?.account?.pendingMetadatas
        // state.selectedAccountExpectedValueOfTurnover = '';
        // state.selectedAccountExpectedVolumeOfTransactions = '';
      })
  },
});

export const selectResetPasswordData = (state: RootState) => state.profile.resetPasswordData;
export const selectResetPasswordError = (state: RootState) => state.profile.error;
export const selectResetPasswordStatus = (state: RootState) => state.profile.status;
export const selectUserData = (state: RootState) => state.profile.userData;
export const selectIndividualMetadata = (state: RootState) => state.profile.individualMetadata;
export const selectPendingMetadata = (state: RootState) => state.profile.pendingMetadata;
export const selectBusinessMetadata = (state: RootState) => state.profile.businessMetadata;
export const selectBankMetadata = (state: RootState) => state.profile.bankMetadata;
// export const selectBrokers = (state: RootState) => state.profile.brokers;
// export const selectDirectors = (state: RootState) => state.profile.directors;
// export const selectShareholders = (state: RootState) => state.profile.shareholders;
// export const selectLinkedUsers = (state: RootState) => state.profile.linkedUsers;
// export const selectAccountUuid = (state: RootState) => state.profile.accountUuid;
export const selectExpectedSpending = (state: RootState) => ({
  expectedVolumeOfTransactions:
    state.profile.expectedVolumeOfTransactions,
  expectedValueOfTurnover:
    state.profile.expectedValueOfTurnover,
});
// export const selectComplyLaunchSearchResult = (state: RootState) => state.profile.complyLaunchSearchResult;
export const selectLoadingStatus = (state: RootState) => state.profile.status;
export const selectError = (state: RootState) => state.profile.error;
// export const documents = (state: RootState) => state.profile.documents;


export const {
  setResetPasswordInfo,
  resetUserData,
  setUserData,
  setIndividualMetaData,
  setBusinessMetaData,
  setBankMetadata,
  setSpending,
  // setDocuments,
} = profileSlice.actions;

export default profileSlice.reducer;
