import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { invitationInitialValues } from './model/invitation-initial-values';
import { invitationDto } from './model/invitation-schema';
import { submitInvitationData } from './UserInvitationApi';

interface InvitationState {
  status: 'loading' | 'idle' | 'error';
  error: string;
  data: invitationDto;
}

const initialState: InvitationState = {
  status: 'idle',
  error: '',
  data: invitationInitialValues,
};

export const submitInvitation = createAsyncThunk(
  'invitation/submit',
  async (_, thunkApi) => {
    const isSubmitted = await submitInvitationData(selectInvitationData(thunkApi.getState() as RootState));
    if (isSubmitted) {
      return;
    }

    throw new Error("Invitation request failed, please try again.");
  }
)

export const invitationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setInvitationData: (state, action:PayloadAction<invitationDto>) => {
      state.data.firstname = action.payload.firstname;
      state.data.lastname = action.payload.lastname;
      state.data.mobileNumber = action.payload.mobileNumber;
      state.data.email = action.payload.email;
      state.data.country = action.payload.country;
      state.data.userRole = action.payload.userRole;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitInvitation.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(submitInvitation.rejected, (state, action) => {
        state.status = 'error';
        if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = 'Submission failed, please try again.';
        }
      })
      .addCase(submitInvitation.fulfilled, (state) => {
        state.status = 'idle';
        state.error = '';
        state.data = invitationInitialValues;
      });
  },
});

export const selectInvitationError = (state: RootState) => state.invitation.error;
export const selectInvitationStatus = (state: RootState) => state.invitation.status;
export const selectInvitationData = (state: RootState) => state.invitation.data;

export const {setInvitationData} = invitationSlice.actions;

export default invitationSlice.reducer;
