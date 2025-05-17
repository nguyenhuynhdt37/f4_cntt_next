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

// Interface for transaction data response
export interface ITransaction {
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    amount: number;
    type: string; // deposit, withdrawal, payment, refund, etc.
    status: string; // completed, pending, failed, etc.
    description: string;
    reference: string; // Reference to associated entity (e.g., bookId, documentId)
    referenceType: string; // Type of reference (e.g., 'book', 'document', 'subscription')
    createdAt: string;
    updatedAt: string;
}

// Interface for transaction statistics
export interface ITransactionStatistics {
    totalTransactions: number;
    totalAmount: number;
    completedTransactions: number;
    completedAmount: number;
    pendingTransactions: number;
    pendingAmount: number;
    failedTransactions: number;
    failedAmount: number;
    transactionsByType: {
        type: string;
        count: number;
        amount: number;
    }[];
    transactionsByDay: {
        date: string;
        count: number;
        amount: number;
    }[];
}

// Get all transactions with pagination and filters
export const getTransactions = async (params: ITransactionParams) => {
    try {
        const response = await axiosInstance.get('/transactions', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get a single transaction by ID
export const getTransactionById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get transaction statistics
export const getTransactionStatistics = async (params?: Partial<ITransactionParams>) => {
    try {
        const response = await axiosInstance.get('/transactions/statistics', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Export transactions (for reports)
export const exportTransactions = async (params?: Partial<ITransactionParams>) => {
    try {
        const response = await axiosInstance.get('/transactions/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
