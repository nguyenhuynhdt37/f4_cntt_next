import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface BorrowTransaction {
    id: string;
    borrower: string;
    borrowerId: string;
    bookId: string;
    bookTitle: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: 'borrowed' | 'returned' | 'overdue';
    note?: string;
}

interface BorrowState {
    transactions: BorrowTransaction[];
    filteredTransactions: BorrowTransaction[];
    currentTransaction: BorrowTransaction | null;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    statusFilter: 'all' | 'borrowed' | 'returned' | 'overdue';
}

// Mock data
const initialTransactions: BorrowTransaction[] = [
    {
        id: '1',
        borrower: 'Nguyễn Văn An',
        borrowerId: 'SV001',
        bookTitle: 'Lập Trình Python Cơ Bản',
        bookId: '1',
        borrowDate: '2023-05-01',
        dueDate: '2023-05-15',
        returnDate: '2023-05-12',
        status: 'returned',
    },
    {
        id: '2',
        borrower: 'Trần Thị Bình',
        borrowerId: 'SV002',
        bookTitle: 'Giáo Trình Java',
        bookId: '2',
        borrowDate: '2023-05-05',
        dueDate: '2023-05-19',
        returnDate: null,
        status: 'borrowed',
    },
    {
        id: '3',
        borrower: 'Lê Văn Cường',
        borrowerId: 'GV001',
        bookTitle: 'Machine Learning Cơ Bản',
        bookId: '3',
        borrowDate: '2023-04-20',
        dueDate: '2023-05-04',
        returnDate: null,
        status: 'overdue',
    },
    {
        id: '4',
        borrower: 'Phạm Thị Dung',
        borrowerId: 'SV003',
        bookTitle: 'Giải Thuật và Lập Trình',
        bookId: '4',
        borrowDate: '2023-05-10',
        dueDate: '2023-05-24',
        returnDate: null,
        status: 'borrowed',
    },
    {
        id: '5',
        borrower: 'Hoàng Văn Em',
        borrowerId: 'SV004',
        bookTitle: 'Mạng Máy Tính',
        bookId: '5',
        borrowDate: '2023-04-25',
        dueDate: '2023-05-09',
        returnDate: '2023-05-08',
        status: 'returned',
    },
];

const initialState: BorrowState = {
    transactions: initialTransactions,
    filteredTransactions: initialTransactions,
    currentTransaction: null,
    loading: false,
    error: null,
    searchTerm: '',
    statusFilter: 'all',
};

// Async thunks for API calls (placeholder for future implementation)
export const fetchTransactions = createAsyncThunk(
    'borrow/fetchTransactions',
    async () => {
        // In a real app, this would be an API call
        // For now, just return the mock data after a simulated delay
        return new Promise<BorrowTransaction[]>((resolve) => {
            setTimeout(() => resolve(initialTransactions), 500);
        });
    }
);

export const addTransaction = createAsyncThunk(
    'borrow/addTransaction',
    async (transaction: Omit<BorrowTransaction, 'id'>) => {
        // In a real app, this would be an API call
        const newTransaction: BorrowTransaction = {
            ...transaction,
            id: Date.now().toString(), // Generate a temporary ID
        };
        return newTransaction;
    }
);

export const returnBook = createAsyncThunk(
    'borrow/returnBook',
    async (id: string) => {
        // In a real app, this would be an API call
        const returnDate = new Date().toISOString().split('T')[0];
        return { id, returnDate };
    }
);

export const updateTransaction = createAsyncThunk(
    'borrow/updateTransaction',
    async (transaction: BorrowTransaction) => {
        // In a real app, this would be an API call
        return transaction;
    }
);

export const deleteTransaction = createAsyncThunk(
    'borrow/deleteTransaction',
    async (id: string) => {
        // In a real app, this would be an API call
        return id;
    }
);

const borrowSlice = createSlice({
    name: 'borrow',
    initialState,
    reducers: {
        setCurrentTransaction: (state, action: PayloadAction<BorrowTransaction | null>) => {
            state.currentTransaction = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
            filterTransactions(state);
        },
        setStatusFilter: (state, action: PayloadAction<'all' | 'borrowed' | 'returned' | 'overdue'>) => {
            state.statusFilter = action.payload;
            filterTransactions(state);
        },
        checkOverdueTransactions: (state) => {
            const today = new Date();
            state.transactions = state.transactions.map(transaction => {
                if (transaction.status === 'borrowed') {
                    const dueDate = new Date(transaction.dueDate);
                    if (dueDate < today && !transaction.returnDate) {
                        return { ...transaction, status: 'overdue' };
                    }
                }
                return transaction;
            });

            // Apply filters again
            filterTransactions(state);
        },
        resetFilters: (state) => {
            state.searchTerm = '';
            state.statusFilter = 'all';
            state.filteredTransactions = state.transactions;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
                state.filteredTransactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch transactions';
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.transactions.push(action.payload);
                filterTransactions(state);
            })
            .addCase(returnBook.fulfilled, (state, action) => {
                const { id, returnDate } = action.payload;
                const index = state.transactions.findIndex((t) => t.id === id);
                if (index !== -1) {
                    state.transactions[index].returnDate = returnDate;
                    state.transactions[index].status = 'returned';
                    filterTransactions(state);
                }
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                const index = state.transactions.findIndex((t) => t.id === action.payload.id);
                if (index !== -1) {
                    state.transactions[index] = action.payload;
                    filterTransactions(state);
                }
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.transactions = state.transactions.filter((t) => t.id !== action.payload);
                filterTransactions(state);
            });
    },
});

// Helper function to apply filters
const filterTransactions = (state: BorrowState) => {
    // First apply search term filter
    let filtered = state.transactions.filter(
        (transaction) =>
            transaction.borrower.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            transaction.borrowerId.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            transaction.bookTitle.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    // Then apply status filter if not 'all'
    if (state.statusFilter !== 'all') {
        filtered = filtered.filter((transaction) => transaction.status === state.statusFilter);
    }

    state.filteredTransactions = filtered;
};

export const {
    setCurrentTransaction,
    setSearchTerm,
    setStatusFilter,
    checkOverdueTransactions,
    resetFilters,
} = borrowSlice.actions;

export default borrowSlice.reducer;
