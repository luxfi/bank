import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import * as ViewCarouselApi from './ViewCarouselApi'

export interface ViewCarouselState{
    activeState: number;
}
const initialState: ViewCarouselState = {
    activeState: 0,
}
export const viewCarouselSlice = createSlice({
    name: 'carousel',
    initialState,
    reducers: {
        setActiveState: (state, action: PayloadAction<ViewCarouselApi.ViewCarousel>)=>{
            state.activeState = action.payload.activeState
        }
    }
})
export const getActiveState = (state: RootState) => state.viewCarousel.activeState;
export const { setActiveState } = viewCarouselSlice.actions;
export default viewCarouselSlice.reducer;
