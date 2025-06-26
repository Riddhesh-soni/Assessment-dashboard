import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    isSlideOverOpen: boolean;
    hoveredDataPoint: any | null;
    hoveredVariableId: string | null;
}

const initialState: UIState = {
    isSlideOverOpen: false,
    hoveredDataPoint: null,
    hoveredVariableId: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openSlideOver: (state) => {
            state.isSlideOverOpen = true;
        },
        closeSlideOver: (state) => {
            state.isSlideOverOpen = false;
        },
        setHoveredDataPoint: (state, action: PayloadAction<any | null>) => {
            state.hoveredDataPoint = action.payload;
        },
        setHoveredVariable: (state, action: PayloadAction<string | null>) => {
            state.hoveredVariableId = action.payload;
        },
    },
});

export const { openSlideOver, closeSlideOver, setHoveredDataPoint, setHoveredVariable } = uiSlice.actions;
export default uiSlice.reducer; 