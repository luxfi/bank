import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as DocumentsApi from './DocumentsApi';
import { RootState } from "../../app/store";
import { UserDocumentsDto } from "./model/userDocumentsValidationSchema";

export interface UserDocumentsState {
  status: 'loading' | 'idle' | 'error';
  error: string;
  data: UserDocumentsDto;
  userDocuments: any[];
  current: string;
}

const initialState: UserDocumentsState = {
  status: 'idle',
  error: '',
  data: { documents: [] },
  userDocuments: [],
  current: ''
};


export const submitUserDocuments = createAsyncThunk(
  'userDocuments/submit',
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const data = selectDocumentData(state);
    const response = await DocumentsApi.updateUserDocuments(data);
    return response;
  }
);

export const deleteUserDocuments = createAsyncThunk(
  'userDocuments/delete',
  async (
    props: {
      uuid: string;
    },
    thunkApi
  ) => {
    const response = await DocumentsApi.deleteDocument(props.uuid);
    return response;
  }
);

export const loadUserDocuments = createAsyncThunk(
  'userDocuments/load',
  async () => {
    return DocumentsApi.getUserDocuments();
  }
);

export const documentsSlice = createSlice({
  name: 'beneficiaries',
  initialState,
  reducers: {
    setDocumentsData: (state, action: PayloadAction<UserDocumentsDto>) => {
      state.status = 'idle';
      state.error = '';
      state.data = action.payload;
    },
    setUserDocuments: (state, action) => {
      const documents = state.userDocuments;
      let newDocuments = documents.filter((document, index) => {
        return document.type !== action.payload.type;
      });
      newDocuments.push(action.payload);
      state.userDocuments = newDocuments;
    },
    setCurrent: (state, action) => {
      state.current = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitUserDocuments.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(submitUserDocuments.rejected, (state, action) => {
        state.status = 'error';
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't update documents, please try again.`;
        }
      })
      .addCase(submitUserDocuments.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = '';
        state.data = { documents: [] };
      })
      .addCase(deleteUserDocuments.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(deleteUserDocuments.rejected, (state, action) => {
        state.status = 'error';
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = `Couldn't update documents, please try again.`;
        }
      })
      .addCase(deleteUserDocuments.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = '';
        state.userDocuments = state.userDocuments.filter(d => d.uuid !== action.meta.arg.uuid)
      })

      .addCase(loadUserDocuments.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(loadUserDocuments.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = '';
        state.userDocuments = action.payload;
      });
  }
});

const selectDocumentData = (state: RootState) => state.userDocuments.data;
export const selectUserDocuments = (state: RootState) => state.userDocuments.userDocuments;
export const selectDocumentsStatus = (state: RootState) => state.userDocuments.status;
export const selectDocumentError = (state: RootState) => state.userDocuments.error;
export const selectCurrent = (state:RootState) => state.userDocuments.current;
export const { setDocumentsData, setUserDocuments, setCurrent } = documentsSlice.actions;

export default documentsSlice.reducer;
