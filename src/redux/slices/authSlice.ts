import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
    user: any;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        saveProfile: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
    },

});

export const { clearError, saveProfile } = authSlice.actions;

export default authSlice.reducer;
