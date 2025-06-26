import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Variable {
    id: string;
    name: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    description: string;
    isActive: boolean;
}

interface VariablesState {
    variables: Variable[];
    selectedVariableId: string | null;
}

const initialState: VariablesState = {
    variables: [
        {
            id: '1',
            name: 'Temperature',
            value: 25,
            min: 0,
            max: 100,
            unit: '°C',
            description: 'Temperature measurement in Celsius',
            isActive: true,
        },
        {
            id: '2',
            name: 'Humidity',
            value: 60,
            min: 0,
            max: 100,
            unit: '%',
            description: 'Relative humidity percentage',
            isActive: true,
        },
        {
            id: '3',
            name: 'Pressure',
            value: 1013,
            min: 900,
            max: 1100,
            unit: 'hPa',
            description: 'Atmospheric pressure in hectopascals',
            isActive: false,
        },
        {
            id: '4',
            name: 'Wind Speed',
            value: 15,
            min: 0,
            max: 50,
            unit: 'km/h',
            description: 'Wind speed in kilometers per hour',
            isActive: true,
        },
    ],
    selectedVariableId: null,
};

const variablesSlice = createSlice({
    name: 'variables',
    initialState,
    reducers: {
        updateVariable: (state, action: PayloadAction<{ id: string; value: number }>) => {
            const variable = state.variables.find(v => v.id === action.payload.id);
            if (variable) {
                variable.value = action.payload.value;
            }
        },
        toggleVariable: (state, action: PayloadAction<string>) => {
            const variable = state.variables.find(v => v.id === action.payload);
            if (variable) {
                variable.isActive = !variable.isActive;
            }
        },
        setSelectedVariable: (state, action: PayloadAction<string | null>) => {
            state.selectedVariableId = action.payload;
        },
    },
});

export const { updateVariable, toggleVariable, setSelectedVariable } = variablesSlice.actions;
export default variablesSlice.reducer; 