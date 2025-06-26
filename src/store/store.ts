import { configureStore } from '@reduxjs/toolkit';
import variablesReducer from './slices/variablesSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        variables: variablesReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 