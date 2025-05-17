import axiosInstance from "./store";

// Interface for transaction search parameters
export interface ITransactionParams {
    page: number;
    size: number;
    search?: string;
    userId?: number;
    type?: string; // deposit, withdrawal, payment, refund, etc.
    status?: string; // completed, pending, failed, etc.
    sortField?: string;
    sortDirection?: string;
    startDate?: string;
    endDate?: string;
}

// Interface for paid users query parameters
export interface IPaidUsersParams {
    page: number;
    size: number;
    term?: string;
    sortBy?: string; // 'amount' or 'days'
    sortDir?: string; // 'asc' or 'desc'
}

// Function to get transactions
export const getTransactions = async ({
    page = 1,
    size = 10,
    search = '',
    userId,
    type,
    status,
    sortField = 'createdAt',
    sortDirection = 'desc',
    startDate,
    endDate
}: ITransactionParams) => {
    try {
        const response = await axiosInstance.get('/admin/transactions', {
            params: {
                page,
                size,
                search,
                userId,
                type,
                status,
                sortField,
                sortDirection,
                startDate,
                endDate
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching transactions:', error);
        throw error.response?.data || { message: 'Unknown error occurred' };
    }
};

// Function to get transaction details by ID
export const getTransactionById = async (id: string | number) => {
    try {
        const response = await axiosInstance.get(`/admin/transactions/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching transaction details:', error);
        throw error.response?.data || { message: 'Unknown error occurred' };
    }
};

// Function to get paid users
export const getPaidUsers = async ({
    page = 1,
    size = 10,
    term = '',
    sortBy = 'amount',
    sortDir = 'desc'
}: IPaidUsersParams) => {
    try {
        const response = await axiosInstance.get('/admin/paid-users', {
            params: {
                page,
                size,
                term,
                sortBy,
                sortDir
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching paid users:', error);
        throw error.response?.data || { message: 'Unknown error occurred' };
    }
}; 