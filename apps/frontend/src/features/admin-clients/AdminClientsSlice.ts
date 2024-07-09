import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AdminUserDto } from "../admin-users/model/adminUserSchema";
import { User } from "../auth/AuthApi";
import { bankMetadataInitialValues } from "../registration/model/bankMetadataInitialValues";
import { BankMetadataDto } from "../registration/model/bankMetadataSchema";
import { BrokerDto } from "../registration/model/brokerSchema";
import { businessMetadataInitialValues } from "../registration/model/businessMetadataInitialValues";
import { BusinessMetadataDto } from "../registration/model/businessMetadataSchema";
import { DirectorDto } from "../registration/model/directorSchema";
import { feeStructureInitialValues } from "../registration/model/feeStructureInitialValues";
import { FeeStructureDto } from "../registration/model/feeStructureSchema";
import { createIndividualMetadataInitialValues } from "../registration/model/individualMetadataInitialValues";
import { IndividualMetadataDto } from "../registration/model/individualMetadataSchema";
import { initialRiskAssessmentValues } from "../registration/model/riskAssessmentInitialValues";
import { RiskAssessmentDto } from "../registration/model/riskAssessmentSchema";
import { ShareholderDto } from "../registration/model/shareholderSchema";
import { EntityType } from "../registration/RegistrationSlice";
import * as AdminClientsApi from "./AdminClientsApi";
import { resetPassword } from "./AdminClientsApi";
import {
  AdminClientDto,
  initialAdminClientData,
} from "./model/adminClientSchema";

const LIMIT = 25;

export interface AdminClientsState {
  status: "loading" | "idle" | "error";
  error: string;
  errors: any;
  data: Record<string, User[]>;
  page: number;
  totalCount: number;

  subaccounts: Record<string, any[]>;

  selectedClientUserData: AdminClientDto;
  selectedClientIndividualMetadata: IndividualMetadataDto;
  selectedClientBusinessMetadata: BusinessMetadataDto;
  selectedClientFeeStructure: FeeStructureDto;
  selectedClientBankMetadata: BankMetadataDto;
  selectedClientRiskAssessment: RiskAssessmentDto;
  selectedClientRiskAssessments: RiskAssessmentDto[] | [];
  selectedAccountExpectedVolumeOfTransactions: string;
  selectedAccountExpectedValueOfTurnover: string;
  selectedClientBrokers: BrokerDto[] | [];
  selectedClientDirectors: DirectorDto[] | [];
  selectedClientShareholders: ShareholderDto[] | [];
  selectedClientLinkedUsers: any[];
  selectedClientAccountUuid: string;
  selectedClientComplyLaunchSearchResult: any[];
  // selectedClientDocuments: clientDocumentDto[] | [];
  selectedClientDocuments: any[];
}

const initialState: AdminClientsState = {
  status: "idle",
  error: "",
  errors: {},
  data: {},
  page: 1,
  totalCount: 0,
  subaccounts: {},

  selectedClientUserData: initialAdminClientData,
  selectedClientIndividualMetadata: createIndividualMetadataInitialValues(null),
  selectedClientFeeStructure: feeStructureInitialValues,
  selectedClientBusinessMetadata: businessMetadataInitialValues,
  selectedClientBankMetadata: bankMetadataInitialValues,
  selectedClientRiskAssessment: initialRiskAssessmentValues,
  selectedClientRiskAssessments: [],
  selectedAccountExpectedValueOfTurnover: "",
  selectedAccountExpectedVolumeOfTransactions: "",
  selectedClientBrokers: [],
  selectedClientDirectors: [],
  selectedClientShareholders: [],
  selectedClientLinkedUsers: [],
  selectedClientAccountUuid: "",
  selectedClientComplyLaunchSearchResult: [],
  selectedClientDocuments: [],
};
export const listSubaccounts = createAsyncThunk(
  "admin-clients/subaccounts",
  async (props: { gateway: any }, thunkApi) => {
    const { count, subaccounts } = await AdminClientsApi.getSubaccounts(
      props.gateway
      // LIMIT            //wrong parameter. This shoud be the page, but seems not necessary here.
    );
    return { subaccounts, gateway: props.gateway };
  }
);

export const submitResetPasswordData = createAsyncThunk(
  "auth/resetPasswordStatus",
  async (props: { resetPasswordData: any; uuid: string }, thunkApi) => {
    const res = await resetPassword(props.resetPasswordData, props.uuid);
    if (res?.client) {
      return res.client;
    } else {
      if (res?.message) {
        throw new Error(res.message);
      }
    }
    throw new Error("Reset Password failed for some reason.");
  }
);

export const listAdminClients = createAsyncThunk(
  "admin-clients/list",
  async (
    props: {
      page: number;
      searchQuery?: string;
    },
    thunkApi
  ) => {
    //const state = thunkApi.getState() as RootState;
    // const currentClients = createAdminClientsSelector(props.page)(state);
    const { count, clients } = await AdminClientsApi.getClients(
      props.page,
      LIMIT,
      props.searchQuery
    );
    return { page: props.page, count, clients };
  }
);
export const linkAdminClient = createAsyncThunk(
  "admin-clients/link",
  async (props: { uuid: string; data: any }, thunkApi) => {
    const user =
      props.data.gateway == "currency_cloud"
        ? await AdminClientsApi.linkClient(props.uuid, props.data)
        : await AdminClientsApi.linkOpenpayd(props.uuid, props.data);
    return user;
  }
);
export const fetchAdminClient = createAsyncThunk(
  "admin-clients/fetch",
  async (props: { uuid: string; clientId?: string }, thunkApi) => {
    const user = await AdminClientsApi.getClient(props.uuid, props.clientId);
    return user;
  }
);

export const submitAdminClient = createAsyncThunk(
  "admin-clients/submit",
  async (props: { uuid: string }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const data = selectAdminClientUserData(state);
    if (props.uuid === "new") {
      return AdminClientsApi.createClient(data);
    } else {
      return AdminClientsApi.updateClient(props.uuid, data);
    }
  }
);

export const submitAdminClientMetadata = createAsyncThunk(
  "admin-clients/submit-metadata",
  async (
    props: { uuid: string; entityType: EntityType; clientId?: string },
    thunkApi
  ) => {
    const state = thunkApi.getState() as RootState;
    const result = await AdminClientsApi.updateClientMetadata(
      props.uuid,
      props.entityType === EntityType.Individual
        ? {
            clientId: props.clientId,
            individualMetadata: selectAdminClientIndividualMetadata(state),
          }
        : {
            clientId: props.clientId,
            businessMetadata: selectAdminClientBusinessMetadata(state),
          }
    )
      .then((r) => r)
      .catch((r) => {
        return thunkApi.rejectWithValue(r);
      });
    return result;
  }
);
export const submitAdminClientFeeStructure = createAsyncThunk(
  "admin-clients/submit-fee-structure",
  async (props: { uuid: string }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const fees = selectAdminClientFeeStructure(state);
    console.error("fees data = ", fees);
    const result = await AdminClientsApi.updateClientMetadata(props.uuid, {
      fees,
      partial: true,
    })
      .then((r) => r)
      .catch((r) => {
        return thunkApi.rejectWithValue(r);
      });
    return result;
  }
);
export const submitAdminClientBankMetadata = createAsyncThunk(
  "admin-clients/submit-bank-metadata",
  async (
    props: {
      uuid: string;
      entityType: EntityType;
      partial?: boolean;
      clientId: string;
    },
    thunkApi
  ) => {
    const state = thunkApi.getState() as RootState;
    const spending = selectAdminClientExpectedSpending(state);
    const result = await AdminClientsApi.updateClientMetadata(props.uuid, {
      clientId: props.clientId,
      bankMetadata: selectAdminClientBankMetadata(state),
      expectedVolumeOfTransactions: spending.expectedVolumeOfTransactions,
      expectedValueOfTurnover: spending.expectedValueOfTurnover,
      partial: true,
    })
      .then((r) => r)
      .catch((r) => {
        return thunkApi.rejectWithValue(r);
      });
    return result;
  }
);

export const submitAdminClientRiskAssessment = createAsyncThunk(
  "admin-clients/submit-risk-assessment",
  async (props: { uuid: string; entityType: EntityType }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const result = await AdminClientsApi.updateClientMetadata(props.uuid, {
      riskAssessment: selectAdminClientRiskAssessment(state),
      partial: true,
    })
      .then((r) => r)
      .catch((r) => {
        return thunkApi.rejectWithValue(r);
      });
    return result;
  }
);

export const submitAdminClientBrokers = createAsyncThunk(
  "admin-clients/brokers",
  async (props: { uuid: string; entityType: EntityType }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const result = await AdminClientsApi.updateClientMetadata(props.uuid, {
      brokers: selectAdminClientBrokers(state),
      partial: true,
    })
      .then((r) => r)
      .catch((r) => {
        return thunkApi.rejectWithValue(r);
      });
    return result;
  }
);

export const submitAdminClientDirectors = createAsyncThunk(
  "admin-clients/directors",
  async (
    props: { uuid: string; entityType: EntityType; clientId?: string },
    thunkApi
  ) => {
    const state = thunkApi.getState() as RootState;
    const result = await AdminClientsApi.updateClientMetadata(props.uuid, {
      clientId: props.clientId,
      directors: selectAdminClientDirectors(state),
      partial: true,
    })
      .then((r) => r)
      .catch((r) => {
        return thunkApi.rejectWithValue(r);
      });
    return result;
  }
);

export const submitAdminClientShareholders = createAsyncThunk(
  "admin-clients/shareholders",
  async (
    props: { uuid: string; entityType: EntityType; clientId: string },
    thunkApi
  ) => {
    const state = thunkApi.getState() as RootState;
    const result = await AdminClientsApi.updateClientMetadata(props.uuid, {
      clientId: props.clientId,
      shareholders: selectAdminClientShareholders(state),
      partial: true,
    })
      .then((r) => r)
      .catch((r) => {
        return thunkApi.rejectWithValue(r);
      });
    return result;
  }
);

export const submitAdminClientSpendingData = createAsyncThunk(
  "admin-clients/spending",
  async (
    props: { uuid: string; entityType: EntityType; clientId: string },
    thunkApi
  ) => {
    const state = thunkApi.getState() as RootState;
    const spending = selectAdminClientExpectedSpending(state);
    const result = await AdminClientsApi.updateClientMetadata(props.uuid, {
      clientId: props.clientId,
      businessMetadata: selectAdminClientBusinessMetadata(state),
      expectedVolumeOfTransactions: spending.expectedVolumeOfTransactions,
      expectedValueOfTurnover: spending.expectedValueOfTurnover,
      partial: true,
    })
      .then((r) => r)
      .catch((r) => {
        return thunkApi.rejectWithValue(r);
      });
    return result;
  }
);

export const submitAdminClientLinkedUserData = createAsyncThunk(
  "admin-clients/linked-user",
  async (props: { data: AdminUserDto; uuid?: string }, thunkApi) => {
    const state = thunkApi.getState() as RootState;

    return AdminClientsApi.addLinkedUser({
      ...props.data,
      clientId: props.uuid,
    });
  }
);
export const updateAdminClientLinkedUserData = createAsyncThunk(
  "admin-clients/linked-user-update",
  async (
    props: { data: AdminUserDto; uuid: string; clientId?: string },
    thunkApi
  ) => {
    return AdminClientsApi.updateLinkedUserInfo(props.uuid, {
      ...props.data,
      clientId: props.clientId,
    });
  }
);

export const submitAdminClientRemoveLinkedUser = createAsyncThunk(
  "admin-client/remove-linked-user",
  async (props: { uuid: string; clientId: string }, thunkApi) => {
    return AdminClientsApi.removeLinkedUser(props.uuid, props.clientId);
  }
);

export const submitAdminClientComplyLaunchSearch = createAsyncThunk(
  "admin-client/comply-launch-search",
  async (props: {}, thunkApi) => {
    let name: string | undefined = "",
      country: string | undefined = "";
    const state = thunkApi.getState() as RootState;
    const client = selectAdminClientUserData(state);
    if (client.entityType === EntityType.Individual) {
      const meta = selectAdminClientIndividualMetadata(state);
      name = meta.firstname + " " + meta.lastname;
      country = meta.country;
    } else if (client.entityType === EntityType.Business) {
      const meta = selectAdminClientBusinessMetadata(state);
      name = meta.companyName;
      country = meta.countryOfRegistration;
    }
    return AdminClientsApi.complyLaunchSearch({ name, country });
  }
);

export const archiveAdminClients = createAsyncThunk(
  "admin-clients/archive",
  async (uuid: string, thunkApi) => {
    const user = await AdminClientsApi.archiveClient(uuid);
    return user;
  }
);

export const approveDocument = createAsyncThunk(
  "admin-clients/approve-document",
  async (props: { owner: string; uuid: string }, thunkApi) => {
    const document = await AdminClientsApi.approveDocument(
      props.owner,
      props.uuid
    );
    return document;
  }
);
export const rejectDocument = createAsyncThunk(
  "admin-clients/reject-document",
  async (props: { owner: string; uuid: string }, thunkApi) => {
    const document = await AdminClientsApi.rejectDocument(
      props.owner,
      props.uuid
    );
    return document;
  }
);

export const adminClientsSlice = createSlice({
  name: "admin-clients",
  initialState,
  reducers: {
    resetAdminClientsData: (state) => {
      state.status = "idle";
      state.error = "";
      state.data = {};
    },
    resetSelectedClientUserData: (state) => {
      state.selectedClientUserData = initialAdminClientData;
      state.selectedClientIndividualMetadata =
        createIndividualMetadataInitialValues(null);
      state.selectedClientBusinessMetadata = businessMetadataInitialValues;
      state.selectedClientFeeStructure = feeStructureInitialValues;
      state.selectedClientBankMetadata = bankMetadataInitialValues;
      state.selectedClientRiskAssessment = initialRiskAssessmentValues;
      state.selectedClientRiskAssessments = [];
      state.selectedAccountExpectedValueOfTurnover = "";
      state.selectedAccountExpectedVolumeOfTransactions = "";
      state.selectedClientBrokers = [];
      state.selectedClientDirectors = [];
      state.selectedClientShareholders = [];
      state.selectedClientLinkedUsers = [];
      state.selectedClientAccountUuid = "";
      state.selectedClientComplyLaunchSearchResult = [];
      state.selectedClientDocuments = [];
    },
    setSelectedClientUserData: (state, action: PayloadAction<any>) => {
      state.selectedClientUserData = {
        ...state.selectedClientUserData,
        ...action.payload,
      };

      if (action.payload.entityType === EntityType.Business) {
        const businessRoleSelect = String(action.payload.businessRoleSelect);
        const businessRole = String(action.payload.businessRole);
        // const businessType = String(action.payload.companyType);
        state.selectedClientUserData.companyType = String(
          action.payload.companyType
        );
        if (businessRoleSelect === "other") {
          state.selectedClientUserData.businessRole = businessRole;
        } else {
          state.selectedClientUserData.businessRole = businessRoleSelect;
        }
      }
    },
    setAdminClientIndividualMetaData: (state, action: PayloadAction<any>) => {
      const metaData = state.selectedClientIndividualMetadata;
      state.selectedClientIndividualMetadata = {
        ...metaData,
        ...action.payload,
      };
    },
    setAdminClientBusinessMetaData: (state, action: PayloadAction<any>) => {
      const metaData = state.selectedClientBusinessMetadata;
      state.selectedClientBusinessMetadata = { ...metaData, ...action.payload };
    },
    setAdminClientBankMetadata: (state, action: PayloadAction<any>) => {
      const bankData = state.selectedClientBankMetadata;
      state.selectedClientBankMetadata = { ...bankData, ...action.payload };
    },
    setAdminClientFeeStructure: (state, action: PayloadAction<any>) => {
      const feeStructure = state.selectedClientFeeStructure;
      state.selectedClientFeeStructure = { ...feeStructure, ...action.payload };
    },
    setAdminClientSpending: (state, action: PayloadAction<any>) => {
      state.selectedAccountExpectedValueOfTurnover =
        action.payload.expectedValueOfTurnover;
      state.selectedAccountExpectedVolumeOfTransactions =
        action.payload.expectedVolumeOfTransactions;
    },
    setRiskAssessmentData: (state, action: PayloadAction<any>) => {
      const riskAssessmentData = state.selectedClientRiskAssessment;
      state.selectedClientRiskAssessment = {
        ...riskAssessmentData,
        ...action.payload,
      };
    },
    setRiskAssessmentsData: (state, action: PayloadAction<any>) => {
      const riskAssessmentsData = state.selectedClientRiskAssessments;
      if (action.payload.remove)
        riskAssessmentsData.splice(action.payload.index, 1);
      else riskAssessmentsData[action.payload.index] = action.payload.broker;
      state.selectedClientRiskAssessments = riskAssessmentsData;
    },
    setAdminClientBrokers: (state, action: PayloadAction<any>) => {
      const brokers = state.selectedClientBrokers;
      if (action.payload.remove) brokers.splice(action.payload.index, 1);
      else brokers[action.payload.index] = action.payload.broker;
      state.selectedClientBrokers = brokers;
    },
    setAdminClientDirectors: (state, action: PayloadAction<any>) => {
      const directors = state.selectedClientDirectors;
      if (action.payload.remove) directors.splice(action.payload.index, 1);
      else directors[action.payload.index] = action.payload.director;
      state.selectedClientDirectors = directors;
    },
    setAdminClientShareholders: (state, action: PayloadAction<any>) => {
      const shareholders = state.selectedClientShareholders;
      if (action.payload.remove) shareholders.splice(action.payload.index, 1);
      else shareholders[action.payload.index] = action.payload.shareholder;
      state.selectedClientShareholders = shareholders;
    },
    setAdminClientDocuments: (state, action: PayloadAction<any>) => {
      const oldDocuments = state.selectedClientDocuments;
      let newDocuments: any[] = [];
      oldDocuments.map((document) => {
        if (document.uuid == action.payload.uuid) {
          let tempDocument = action.payload;
          tempDocument.document = document.document;
          newDocuments.push(tempDocument);
        } else newDocuments.push(document);
      });
      state.selectedClientDocuments = newDocuments;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listSubaccounts.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(listSubaccounts.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't fetch the subaccounts, please try again.`;
        }
      })
      .addCase(listSubaccounts.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        if (action.payload?.subaccounts) {
          state.subaccounts[action.payload.gateway] =
            action.payload?.subaccounts;
        }
      })
      .addCase(listAdminClients.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(listAdminClients.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't fetch the clients, please try again.`;
        }
      })
      .addCase(listAdminClients.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";

        if (action.payload?.page && action.payload?.clients) {
          state.data[action.payload?.page] = action.payload?.clients;
          state.page = action.payload?.page;
        }

        if (action.payload?.count) {
          state.totalCount = action.payload.count;
        }
      })
      .addCase(linkAdminClient.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        const client: any = action.payload;
        state.selectedClientUserData.contact = client.contact;
        state.selectedClientUserData.cloudCurrencyId =
          client.contact?.cloudCurrencyId;
      })
      .addCase(fetchAdminClient.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchAdminClient.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't fetch the user, please try again.`;
        }
      })
      .addCase(fetchAdminClient.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        const client: any = action.payload;
        const businessRole =
          client.contact?.businessRole || initialAdminClientData.businessRole;
        state.selectedClientUserData = {
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
          skipWelcomeEmail: "yes",
          complyLaunchId: client.contact.complyLaunchId,
        };
        state.selectedClientFeeStructure =
          client.contact?.account?.fee || feeStructureInitialValues;
        state.selectedClientIndividualMetadata =
          client.contact?.account?.individualMetadata ||
          createIndividualMetadataInitialValues(client);
        state.selectedClientBusinessMetadata =
          client.contact?.account?.businessMetadata ||
          businessMetadataInitialValues;
        state.selectedAccountExpectedValueOfTurnover =
          client.contact?.expectedValueOfTurnover;
        state.selectedAccountExpectedVolumeOfTransactions =
          client.contact?.expectedVolumeOfTransactions;
        state.selectedClientBankMetadata =
          client.contact?.account?.bankMetadata || bankMetadataInitialValues;
        state.selectedClientRiskAssessment =
          client.contact?.account?.riskAssessment ||
          initialRiskAssessmentValues;
        state.selectedClientRiskAssessments =
          client.contact?.account?.riskAssessments || [];
        state.selectedClientBrokers =
          client.contact?.account?.brokers.sort(
            (a: BrokerDto, b: BrokerDto) => {
              return (
                new Date(a.createdAt as string).getTime() -
                new Date(b.createdAt as string).getTime()
              );
            }
          ) || [];
        state.selectedClientDirectors =
          client.contact?.account?.directors.sort(
            (a: DirectorDto, b: DirectorDto) => {
              return (
                new Date(a.createdAt as string).getTime() -
                new Date(b.createdAt as string).getTime()
              );
            }
          ) || [];
        state.selectedClientShareholders =
          client.contact?.account?.shareholders.sort(
            (a: ShareholderDto, b: ShareholderDto) => {
              return (
                new Date(a.createdAt as string).getTime() -
                new Date(b.createdAt as string).getTime()
              );
            }
          ) || [];

        const users = client.contact?.account?.users?.filter(
          (item: any) => item.uuid !== client.uuid
        );

        state.selectedClientLinkedUsers = users;
        state.selectedClientAccountUuid = client.contact?.account?.uuid;
        state.selectedClientDocuments = client.documents;
      })

      .addCase(submitAdminClient.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitAdminClient.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't submit the user, please try again.`;
        }
      })
      .addCase(submitAdminClient.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        const client: any = action.payload;
        const businessRole =
          client.contact?.businessRole || initialAdminClientData.businessRole;
        state.selectedClientUserData = {
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
          skipWelcomeEmail: "yes",
          complyLaunchId: client.contact.complyLaunchId,
        };
      })

      .addCase(submitAdminClientMetadata.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitAdminClientMetadata.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't update the metadata, please try again.`;
        }
      })
      .addCase(submitAdminClientMetadata.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.selectedClientIndividualMetadata =
          action.payload.contact?.account.individualMetadata;
        state.selectedClientBusinessMetadata =
          action.payload.contact?.account?.businessMetadata;
      })

      .addCase(submitAdminClientBankMetadata.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitAdminClientBankMetadata.rejected, (state, action) => {
        state.status = "error";
        state.errors = action.payload;
        state.error = `Couldn't update the metadata, please try again.`;
      })
      .addCase(submitAdminClientBankMetadata.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.selectedClientBankMetadata =
          action.payload.contact?.account?.bankMetadata;
        // state.selectedAccountExpectedValueOfTurnover = '';
        // state.selectedAccountExpectedVolumeOfTransactions = '';
      })

      .addCase(submitAdminClientRiskAssessment.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitAdminClientRiskAssessment.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't update the metadata, please try again.`;
        }
      })
      .addCase(submitAdminClientRiskAssessment.fulfilled, (state) => {
        state.status = "idle";
        state.error = "";
        state.selectedClientBankMetadata = bankMetadataInitialValues;
        state.selectedAccountExpectedValueOfTurnover = "";
        state.selectedAccountExpectedVolumeOfTransactions = "";
      })
      .addCase(submitAdminClientBrokers.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.selectedClientBrokers = action.payload.contact?.account?.brokers;
      })
      .addCase(submitAdminClientBrokers.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitAdminClientBrokers.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't update the broker data, please try again.`;
        }
      })

      .addCase(submitAdminClientDirectors.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.selectedClientDirectors =
          action.payload.contact?.account?.directors;
      })
      .addCase(submitAdminClientDirectors.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitAdminClientDirectors.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't update the director data, please try again.`;
        }
      })
      .addCase(submitAdminClientShareholders.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        state.selectedClientShareholders = action.payload.contact?.account
          ?.shareholders as ShareholderDto[];
      })
      .addCase(submitAdminClientShareholders.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(submitAdminClientShareholders.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't update the shareholder data, please try again.`;
        }
      })
      .addCase(submitAdminClientLinkedUserData.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        let linkedUsers = state.selectedClientLinkedUsers;
        let flag = -1;
        linkedUsers.forEach((user, index) => {
          if (user.uuid === action.payload.uuid) {
            flag = index;
          }
        });
        if (flag === -1) linkedUsers.push(action.payload);
        else linkedUsers[flag] = action.payload;
        state.selectedClientLinkedUsers = linkedUsers;
      })
      .addCase(submitAdminClientLinkedUserData.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })

      .addCase(submitAdminClientLinkedUserData.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't add the user, please try again.`;
        }
      })
      .addCase(submitAdminClientRemoveLinkedUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        let linkedUsers = state.selectedClientLinkedUsers;
        let flag = -1;
        linkedUsers.forEach((user, index) => {
          if (user.uuid === action.payload.uuid) {
            flag = index;
          }
        });
        if (flag !== -1) linkedUsers.splice(flag, 1);
        state.selectedClientLinkedUsers = linkedUsers;
      })
      .addCase(submitAdminClientRemoveLinkedUser.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })

      .addCase(submitAdminClientRemoveLinkedUser.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't add the user, please try again.`;
        }
      })

      .addCase(
        submitAdminClientComplyLaunchSearch.fulfilled,
        (state, action) => {
          state.selectedClientComplyLaunchSearchResult = action.payload;
        }
      )

      .addCase(archiveAdminClients.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(archiveAdminClients.rejected, (state, action) => {
        state.status = "error";
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't archive the client, please try again.`;
        }
      })
      .addCase(archiveAdminClients.fulfilled, (state, action) => {
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
  resetAdminClientsData,
  resetSelectedClientUserData,
  setSelectedClientUserData,
  setAdminClientIndividualMetaData,
  setAdminClientBusinessMetaData,
  setAdminClientBankMetadata,
  setRiskAssessmentData,
  setRiskAssessmentsData,
  setAdminClientBrokers,
  setAdminClientDirectors,
  setAdminClientShareholders,
  setAdminClientSpending,
  setAdminClientDocuments,
  setAdminClientFeeStructure,
} = adminClientsSlice.actions;

export const createAdminClientsSelector =
  (page = 1) =>
  (state: RootState) =>
    state.adminClients.data[page] || [];
export const selectSubaccounts = (state: RootState) =>
  state.adminClients.subaccounts;
export const selectAdminClientUserData = (state: RootState) =>
  state.adminClients.selectedClientUserData;
export const selectAdminClientIndividualMetadata = (state: RootState) =>
  state.adminClients.selectedClientIndividualMetadata;
export const selectAdminClientBusinessMetadata = (state: RootState) =>
  state.adminClients.selectedClientBusinessMetadata;
export const selectAdminClientFeeStructure = (state: RootState) =>
  state.adminClients.selectedClientFeeStructure;
export const selectAdminClientBankMetadata = (state: RootState) =>
  state.adminClients.selectedClientBankMetadata;
export const selectAdminClientRiskAssessment = (state: RootState) =>
  state.adminClients.selectedClientRiskAssessment;
export const selectAdminClientRiskAssessments = (state: RootState) =>
  state.adminClients.selectedClientRiskAssessments;
export const selectAdminClientBrokers = (state: RootState) =>
  state.adminClients.selectedClientBrokers;
export const selectAdminClientDirectors = (state: RootState) =>
  state.adminClients.selectedClientDirectors;
export const selectAdminClientShareholders = (state: RootState) =>
  state.adminClients.selectedClientShareholders;
export const selectAdminClientLinkedUsers = (state: RootState) =>
  state.adminClients.selectedClientLinkedUsers;
export const selectAdminClientAccountUuid = (state: RootState) =>
  state.adminClients.selectedClientAccountUuid;
export const selectAdminClientExpectedSpending = (state: RootState) => ({
  expectedVolumeOfTransactions:
    state.adminClients.selectedAccountExpectedVolumeOfTransactions,
  expectedValueOfTurnover:
    state.adminClients.selectedAccountExpectedValueOfTurnover,
});
export const selectAdminClientComplyLaunchSearchResult = (state: RootState) =>
  state.adminClients.selectedClientComplyLaunchSearchResult;
export const selectAdminClientsNumberOfPages = (state: RootState) =>
  Math.ceil(state.adminClients.totalCount / LIMIT);
export const selectAdminClientsCurrentPage = (state: RootState) =>
  state.adminClients.page;
export const selectAdminClientsLoadingStatus = (state: RootState) =>
  state.adminClients.status;
export const selectAdminClientsError = (state: RootState) =>
  state.adminClients.error;
export const selectAdminClientsErrors = (state: RootState) =>
  state.adminClients.errors;
export const selectAdminClientDocuments = (state: RootState) =>
  state.adminClients.selectedClientDocuments;
export default adminClientsSlice.reducer;
