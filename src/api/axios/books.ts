import axiosInstance from "./store";

// Interface for book search parameters
export interface IBookParams {
    page: number;
    size: number;
    search?: string;
    authorId?: number;
    publisherId?: number;
    categoryId?: number;
    sortField?: string;
    sortDirection?: string;
    status?: string; // 'available', 'limited', 'unavailable'
}

// Interface for book data
export interface IBookData {
    id?: number;
    title: string;
    description: string;
    authorId: number;
    publisherId: number;
    categoryId: number;
    publishDate: string;
    isbn: string;
    quantity: number;
    pageCount?: number;
    language?: string;
    location?: string;
    coverImage?: File | null;
}

// Interface for book details (response from server)
export interface IBookDetails {
    id: number;
    title: string;
    description: string;
    author: {
        id: number;
        name: string;
    };
    publisher: {
        id: number;
        name: string;
    };
    category: {
        id: number;
        name: string;
    };
    publishDate: string;
    isbn: string;
    quantity: number;
    availableQuantity: number;
    pageCount: number;
    language: string;
    location: string;
    coverImageUrl: string;
    borrowCount: number;
    createdAt: string;
    updatedAt: string;
}

// Get all books with pagination and filters
export const getBooks = async (params: IBookParams) => {
    try {
        const response = await axiosInstance.get('/books', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get a single book by ID
export const getBookById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/books/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new book
export const createBook = async (bookData: IBookData) => {
    try {
        const formData = new FormData();

        // Add all text fields to form data
        Object.entries(bookData).forEach(([key, value]) => {
            if (key !== 'coverImage' && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        // Add cover image if present
        if (bookData.coverImage) {
            formData.append('coverImage', bookData.coverImage);
        }

        const response = await axiosInstance.post('/books', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update an existing book
export const updateBook = async (id: number, bookData: Partial<IBookData>) => {
    try {
        const formData = new FormData();

        // Add all text fields to form data
        Object.entries(bookData).forEach(([key, value]) => {
            if (key !== 'coverImage' && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        // Add cover image if present
        if (bookData.coverImage) {
            formData.append('coverImage', bookData.coverImage);
        }

        const response = await axiosInstance.put(`/books/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a book
export const deleteBook = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/books/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
