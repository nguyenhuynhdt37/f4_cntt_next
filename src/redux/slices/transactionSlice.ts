import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTransactions, getTransactionStatistics, ITransactionParams } from '@/api/axios/transactions';

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (params: ITransactionParams, { rejectWithValue }) => {
        try {
            const response = await getTransactions(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

export const fetchTransactionStatistics = createAsyncThunk(
    'transactions/fetchStatistics',
    async (params: Partial<ITransactionParams> = {}, { rejectWithValue }) => {
        try {
            const response = await getTransactionStatistics(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

interface TransactionState {
    transactions: {
        data: any[];
        meta: {
            total: number;
            page: number;
            size: number;
            totalPages: number;
        };
    };
    statistics: any | null;
    loading: boolean;
    statisticsLoading: boolean;
    error: string | null;
}

const initialState: TransactionState = {
    transactions: {
        data: [],
        meta: {
            total: 0,
            page: 1,
            size: 10,
            totalPages: 1,
        },
    },
    statistics: null,
    loading: false,
    statisticsLoading: false,
    error: null,
};

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        resetTransactionState: () => initialState,
    },
    extraReducers: (builder) => {
        // Fetch transactions
        builder.addCase(fetchTransactions.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTransactions.fulfilled, (state, action) => {
            state.loading = false;
            state.transactions = action.payload;
        });
        builder.addCase(fetchTransactions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch statistics
        builder.addCase(fetchTransactionStatistics.pending, (state) => {
            state.statisticsLoading = true;
            state.error = null;
        });
        builder.addCase(fetchTransactionStatistics.fulfilled, (state, action) => {
            state.statisticsLoading = false;
            state.statistics = action.payload;
        });
        builder.addCase(fetchTransactionStatistics.rejected, (state, action) => {
            state.statisticsLoading = false;
            state.error = action.payload as string;
        });
    },
});

export const { resetTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;
