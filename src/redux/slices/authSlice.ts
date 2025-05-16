import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    username: string;
    role: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
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


export const logout = createAsyncThunk('auth/logout', async () => {
    // Clear localStorage
    localStorage.removeItem('f8_admin_user');
    localStorage.removeItem('f8_admin_token');
    return true;
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
    const savedUser = localStorage.getItem('f8_admin_user');
    const savedToken = localStorage.getItem('f8_admin_token');

    if (savedUser && savedToken) {
        return {
            user: JSON.parse(savedUser),
            token: savedToken,
        };
    }

    throw new Error('Not authenticated');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        saveProfile: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
    },

});

export const { clearError, saveProfile } = authSlice.actions;

export default authSlice.reducer;
