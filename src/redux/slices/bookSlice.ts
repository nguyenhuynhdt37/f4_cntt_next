import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    publishedYear: string;
    publisher: string;
    description: string;
    coverimg: string;
    totalCopies: number;
    availableCopies: number;
    status: 'available' | 'unavailable';
}

interface BookState {
    books: Book[];
    filteredBooks: Book[];
    currentBook: Book | null;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    filterCategory: string;
}

// Mock data
const initialBooks: Book[] = [
    {
        id: '1',
        title: 'Lập Trình Python Cơ Bản',
        author: 'Nguyễn Văn A',
        isbn: '978-604-12345-1',
        category: 'programming',
        publishedYear: '2022',
        publisher: 'NXB Giáo dục',
        description: 'Sách giới thiệu về ngôn ngữ lập trình Python từ cơ bản đến nâng cao.',
        coverimg: '/books/python-basic.jpg',
        totalCopies: 10,
        availableCopies: 8,
        status: 'available',
    },
    {
        id: '2',
        title: 'Giáo Trình Java',
        author: 'Trần Thị B',
        isbn: '978-604-12345-2',
        category: 'programming',
        publishedYear: '2021',
        publisher: 'NXB Bách khoa Hà Nội',
        description: 'Giáo trình giảng dạy ngôn ngữ lập trình Java cho sinh viên IT.',
        coverimg: '/books/java-textbook.jpg',
        totalCopies: 15,
        availableCopies: 12,
        status: 'available',
    },
    {
        id: '3',
        title: 'Machine Learning Cơ Bản',
        author: 'Lê Văn C',
        isbn: '978-604-12345-3',
        category: 'data-science',
        publishedYear: '2023',
        publisher: 'NXB Khoa học và Kỹ thuật',
        description: 'Giới thiệu các thuật toán và kỹ thuật machine learning cơ bản.',
        coverimg: '/books/ml-basic.jpg',
        totalCopies: 5,
        availableCopies: 0,
        status: 'unavailable',
    },
    {
        id: '4',
        title: 'Giải Thuật và Lập Trình',
        author: 'Phạm Thị D',
        isbn: '978-604-12345-4',
        category: 'algorithms',
        publishedYear: '2020',
        publisher: 'NXB Giáo dục',
        description: 'Sách giảng dạy về các thuật toán và kỹ thuật lập trình.',
        coverimg: '/books/algorithms.jpg',
        totalCopies: 20,
        availableCopies: 15,
        status: 'available',
    },
    {
        id: '5',
        title: 'Mạng Máy Tính',
        author: 'Hoàng Văn E',
        isbn: '978-604-12345-5',
        category: 'networking',
        publishedYear: '2021',
        publisher: 'NXB Thông tin và Truyền thông',
        description: 'Giáo trình về mạng máy tính và các giao thức mạng.',
        coverimg: '/books/networking.jpg',
        totalCopies: 8,
        availableCopies: 3,
        status: 'available',
    },
];

const initialState: BookState = {
    books: initialBooks,
    filteredBooks: initialBooks,
    currentBook: null,
    loading: false,
    error: null,
    searchTerm: '',
    filterCategory: '',
};

// Async thunks for API calls (placeholder for future implementation)
export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
    // In a real app, this would be an API call
    // For now, just return the mock data after a simulated delay
    return new Promise<Book[]>((resolve) => {
        setTimeout(() => resolve(initialBooks), 500);
    });
});

export const addBook = createAsyncThunk(
    'books/addBook',
    async (book: Omit<Book, 'id'>) => {
        // In a real app, this would be an API call
        const newBook: Book = {
            ...book,
            id: Date.now().toString(), // Generate a temporary ID
        };
        return newBook;
    }
);

export const updateBook = createAsyncThunk(
    'books/updateBook',
    async (book: Book) => {
        // In a real app, this would be an API call
        return book;
    }
);

export const deleteBook = createAsyncThunk(
    'books/deleteBook',
    async (id: string) => {
        // In a real app, this would be an API call
        return id;
    }
);

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setCurrentBook: (state, action: PayloadAction<Book | null>) => {
            state.currentBook = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
            state.filteredBooks = state.books.filter(
                (book) =>
                    book.title.toLowerCase().includes(action.payload.toLowerCase()) ||
                    book.author.toLowerCase().includes(action.payload.toLowerCase()) ||
                    book.isbn.toLowerCase().includes(action.payload.toLowerCase())
            );

            if (state.filterCategory) {
                state.filteredBooks = state.filteredBooks.filter(
                    (book) => book.category === state.filterCategory
                );
            }
        },
        setFilterCategory: (state, action: PayloadAction<string>) => {
            state.filterCategory = action.payload;

            // First apply search term filter
            let filtered = state.books.filter(
                (book) =>
                    book.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                    book.author.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                    book.isbn.toLowerCase().includes(state.searchTerm.toLowerCase())
            );

            // Then apply category filter if present
            if (action.payload) {
                filtered = filtered.filter((book) => book.category === action.payload);
            }

            state.filteredBooks = filtered;
        },
        resetFilters: (state) => {
            state.searchTerm = '';
            state.filterCategory = '';
            state.filteredBooks = state.books;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
                state.filteredBooks = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch books';
            })
            .addCase(addBook.fulfilled, (state, action) => {
                state.books.push(action.payload);
                state.filteredBooks = state.books;
            })
            .addCase(updateBook.fulfilled, (state, action) => {
                const index = state.books.findIndex((book) => book.id === action.payload.id);
                if (index !== -1) {
                    state.books[index] = action.payload;
                    state.filteredBooks = state.books;
                }
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.books = state.books.filter((book) => book.id !== action.payload);
                state.filteredBooks = state.books;
            });
    },
});

export const { setCurrentBook, setSearchTerm, setFilterCategory, resetFilters } = bookSlice.actions;

export default bookSlice.reducer;
