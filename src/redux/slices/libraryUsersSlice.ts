import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface LibraryUser {
    id: string;
    name: string;
    email: string;
    userId: string;
    role: 'student' | 'teacher' | 'staff';
    phone: string;
    status: 'active' | 'blocked';
    totalBorrowed: number;
    currentBorrowed: number;
    joinDate: string;
}

interface UserState {
    users: LibraryUser[];
    filteredUsers: LibraryUser[];
    currentUser: LibraryUser | null;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    roleFilter: 'all' | 'student' | 'teacher' | 'staff';
    statusFilter: 'all' | 'active' | 'blocked';
}

// Mock data
const initialUsers: LibraryUser[] = [
    {
        id: '1',
        name: 'Nguyễn Văn An',
        email: 'an.nguyenvan@example.com',
        userId: 'SV001',
        role: 'student',
        phone: '0901234567',
        status: 'active',
        totalBorrowed: 12,
        currentBorrowed: 2,
        joinDate: '2022-09-01',
    },
    {
        id: '2',
        name: 'Trần Thị Bình',
        email: 'binh.tranthi@example.com',
        userId: 'SV002',
        role: 'student',
        phone: '0907654321',
        status: 'active',
        totalBorrowed: 8,
        currentBorrowed: 1,
        joinDate: '2022-09-15',
    },
    {
        id: '3',
        name: 'Lê Văn Cường',
        email: 'cuong.levan@example.com',
        userId: 'GV001',
        role: 'teacher',
        phone: '0912345678',
        status: 'active',
        totalBorrowed: 24,
        currentBorrowed: 3,
        joinDate: '2021-05-20',
    },
    {
        id: '4',
        name: 'Phạm Thị Dung',
        email: 'dung.phamthi@example.com',
        userId: 'SV003',
        role: 'student',
        phone: '0923456789',
        status: 'blocked',
        totalBorrowed: 15,
        currentBorrowed: 0,
        joinDate: '2023-02-10',
    },
    {
        id: '5',
        name: 'Hoàng Văn Em',
        email: 'em.hoangvan@example.com',
        userId: 'SV004',
        role: 'student',
        phone: '0934567890',
        status: 'active',
        totalBorrowed: 5,
        currentBorrowed: 0,
        joinDate: '2023-08-05',
    },
];

const initialState: UserState = {
    users: initialUsers,
    filteredUsers: initialUsers,
    currentUser: null,
    loading: false,
    error: null,
    searchTerm: '',
    roleFilter: 'all',
    statusFilter: 'all',
};

// Async thunks for API calls (placeholder for future implementation)
export const fetchUsers = createAsyncThunk(
    'libraryUsers/fetchUsers',
    async () => {
        // In a real app, this would be an API call
        // For now, just return the mock data after a simulated delay
        return new Promise<LibraryUser[]>((resolve) => {
            setTimeout(() => resolve(initialUsers), 500);
        });
    }
);

export const addUser = createAsyncThunk(
    'libraryUsers/addUser',
    async (user: Omit<LibraryUser, 'id' | 'totalBorrowed' | 'currentBorrowed'>) => {
        // In a real app, this would be an API call
        const newUser: LibraryUser = {
            ...user,
            id: Date.now().toString(), // Generate a temporary ID
            totalBorrowed: 0,
            currentBorrowed: 0,
        };
        return newUser;
    }
);

export const updateUser = createAsyncThunk(
    'libraryUsers/updateUser',
    async (user: LibraryUser) => {
        // In a real app, this would be an API call
        return user;
    }
);

export const toggleUserStatus = createAsyncThunk(
    'libraryUsers/toggleUserStatus',
    async (id: string, { getState }: any) => {
        const state = getState().libraryUsers;
        const user = state.users.find((u: LibraryUser) => u.id === id);
        if (user) {
            const newStatus = user.status === 'active' ? 'blocked' : 'active';
            return { id, status: newStatus };
        }
        throw new Error('User not found');
    }
);

export const deleteUser = createAsyncThunk(
    'libraryUsers/deleteUser',
    async (id: string) => {
        // In a real app, this would be an API call
        return id;
    }
);

const libraryUsersSlice = createSlice({
    name: 'libraryUsers',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<LibraryUser | null>) => {
            state.currentUser = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
            filterUsers(state);
        },
        setRoleFilter: (state, action: PayloadAction<'all' | 'student' | 'teacher' | 'staff'>) => {
            state.roleFilter = action.payload;
            filterUsers(state);
        },
        setStatusFilter: (state, action: PayloadAction<'all' | 'active' | 'blocked'>) => {
            state.statusFilter = action.payload;
            filterUsers(state);
        },
        resetFilters: (state) => {
            state.searchTerm = '';
            state.roleFilter = 'all';
            state.statusFilter = 'all';
            state.filteredUsers = state.users;
        },
        updateBorrowStats: (state, action: PayloadAction<{ userId: string; isBorrowing: boolean; isReturning: boolean }>) => {
            const { userId, isBorrowing, isReturning } = action.payload;
            const userIndex = state.users.findIndex(u => u.userId === userId);

            if (userIndex !== -1) {
                if (isBorrowing) {
                    state.users[userIndex].totalBorrowed += 1;
                    state.users[userIndex].currentBorrowed += 1;
                } else if (isReturning) {
                    state.users[userIndex].currentBorrowed = Math.max(0, state.users[userIndex].currentBorrowed - 1);
                }

                filterUsers(state);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.filteredUsers = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch users';
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
                filterUsers(state);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex((user) => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                    filterUsers(state);
                }
            })
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                const index = state.users.findIndex((user) => user.id === id);
                if (index !== -1) {
                    state.users[index].status = status;
                    filterUsers(state);
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user.id !== action.payload);
                filterUsers(state);
            });
    },
});

// Helper function to apply filters
const filterUsers = (state: UserState) => {
    // First apply search term filter
    let filtered = state.users.filter(
        (user) =>
            user.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            user.userId.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    // Then apply role filter if not 'all'
    if (state.roleFilter !== 'all') {
        filtered = filtered.filter((user) => user.role === state.roleFilter);
    }

    // Then apply status filter if not 'all'
    if (state.statusFilter !== 'all') {
        filtered = filtered.filter((user) => user.status === state.statusFilter);
    }

    state.filteredUsers = filtered;
};

export const {
    setCurrentUser,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    resetFilters,
    updateBorrowStats,
} = libraryUsersSlice.actions;

export default libraryUsersSlice.reducer;
