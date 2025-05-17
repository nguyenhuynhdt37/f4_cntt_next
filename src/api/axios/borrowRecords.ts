import axiosInstance from "./store";

// Interface for borrow records search parameters
export interface IBorrowRecordsParams {
    page: number;
    size: number;
    search?: string;
    userId?: number;
    bookId?: number;
    status?: 'borrowed' | 'returned' | 'overdue' | 'all';
    sortField?: string;
    sortDirection?: string;
    startDate?: string;
    endDate?: string;
}

// Interface for creating a borrow record
export interface ICreateBorrowRecord {
    userId: number;
    bookIds: number[];
    borrowDate: string;
    dueDate: string;
    notes?: string;
}

// Interface for updating a borrow record
export interface IUpdateBorrowRecord {
    id: number;
    returnDate?: string;
    status?: 'borrowed' | 'returned' | 'overdue';
    notes?: string;
}

// Interface for borrow record details
export interface IBorrowRecordDetails {
    id: number;
    user: {
        id: number;
        name: string;
        studentId: string;
        email: string;
    };
    books: {
        id: number;
        title: string;
        author: string;
        coverImageUrl: string;
        isbn: string;
    }[];
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: 'borrowed' | 'returned' | 'overdue';
    notes: string;
    createdAt: string;
    updatedAt: string;
}

// Get all borrow records with pagination and filters
export const getBorrowRecords = async (params: IBorrowRecordsParams) => {
    try {
        const response = await axiosInstance.get('/borrow-records', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get a single borrow record by ID
export const getBorrowRecordById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/borrow-records/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new borrow record
export const createBorrowRecord = async (borrowData: ICreateBorrowRecord) => {
    try {
        const response = await axiosInstance.post('/borrow-records', borrowData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update an existing borrow record (e.g., mark as returned)
export const updateBorrowRecord = async (id: number, borrowData: Partial<IUpdateBorrowRecord>) => {
    try {
        const response = await axiosInstance.put(`/borrow-records/${id}`, borrowData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a borrow record
export const deleteBorrowRecord = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/borrow-records/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Mark a book as returned
export const returnBook = async (borrowRecordId: number) => {
    try {
        const response = await axiosInstance.patch(`/borrow-records/${borrowRecordId}/return`, {
            returnDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
