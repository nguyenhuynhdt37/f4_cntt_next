'use client';

import React, { useState, useEffect } from 'react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import {
    fetchBooks,
    setSearchTerm,
    setFilterCategory,
    setCurrentBook,
    addBook,
    updateBook,
    deleteBook,
    resetFilters,
    type Book
} from '@/redux/slices/bookSlice';

// Book component to display a single book row
interface BookItemProps {
    book: Book;
    onEdit: (book: Book) => void;
    onDelete: (id: string) => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, onEdit, onDelete }) => {
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{book.title}</div>
                <div className="text-sm text-gray-500">{book.author}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {book.category}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.publishedYear}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.publisher}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {book.status === 'available' ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Có sẵn
                    </span>
                ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Hết sách
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.availableCopies} / {book.totalCopies}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => onEdit(book)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onDelete(book.id)}
                    className="text-red-600 hover:text-red-900"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </td>
        </tr>
    );
};

// Form data interface
interface BookFormData {
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
}

const BooksManagementClient: React.FC = () => {
    const dispatch = useAppDispatch();
    const { books, filteredBooks, loading, error, searchTerm, filterCategory } = useAppSelector((state) => state.books);

    const [sortField, setSortField] = useState<string>('title');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [currentBook, setEditingBook] = useState<Book | null>(null);

    // Form state for add/edit modal
    const [formData, setFormData] = useState<BookFormData>({
        title: '',
        author: '',
        isbn: '',
        category: '',
        publishedYear: '',
        publisher: '',
        description: '',
        coverimg: '',
        totalCopies: 1,
        availableCopies: 1,
    });

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);

    const handleSort = (field: string) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchTerm(e.target.value));
    };

    const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setFilterCategory(e.target.value));
    };

    const handleResetFilters = () => {
        dispatch(resetFilters());
    };

    const handleEdit = (book: Book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            isbn: book.isbn || '',
            category: book.category,
            publishedYear: book.publishedYear || '',
            publisher: book.publisher || '',
            description: book.description || '',
            coverimg: book.coverimg || '',
            totalCopies: book.totalCopies,
            availableCopies: book.availableCopies,
        });
        setShowAddModal(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
            dispatch(deleteBook(id));
        }
    };

    const handleAddNewClick = () => {
        setEditingBook(null);
        setFormData({
            title: '',
            author: '',
            isbn: '',
            category: '',
            publishedYear: '',
            publisher: '',
            description: '',
            coverimg: '',
            totalCopies: 1,
            availableCopies: 1,
        });
        setShowAddModal(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'totalCopies' || name === 'availableCopies' ? parseInt(value) : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (currentBook) {
            // Update existing book
            dispatch(updateBook({
                id: currentBook.id,
                ...formData,
                status: formData.availableCopies > 0 ? 'available' : 'unavailable',
            }));
        } else {
            // Add new book
            dispatch(addBook({
                ...formData,
                status: formData.availableCopies > 0 ? 'available' : 'unavailable',
            }));
        }

        setShowAddModal(false);
    };

    // Sort books based on sort field and direction
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        const aValue = a[sortField as keyof Book];
        const bValue = b[sortField as keyof Book];

        if (aValue < bValue) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Quản lý sách</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Danh sách tất cả sách trong thư viện, bao gồm thông tin về tác giả, thể loại và tình trạng mượn.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={handleAddNewClick}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                        Thêm sách mới
                    </button>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="mb-4 flex flex-wrap gap-4 justify-between items-center">
                            <div className="relative min-w-[250px]">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                    placeholder="Tìm kiếm sách..."
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <select
                                    id="category"
                                    value={filterCategory}
                                    onChange={handleCategoryFilterChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                >
                                    <option value="">Tất cả thể loại</option>
                                    <option value="programming">Lập trình</option>
                                    <option value="data-science">Khoa học dữ liệu</option>
                                    <option value="algorithms">Thuật toán</option>
                                    <option value="networking">Mạng máy tính</option>
                                </select>

                                <button
                                    onClick={handleResetFilters}
                                    className="text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Đặt lại bộ lọc
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                                            onClick={() => handleSort('title')}
                                        >
                                            <div className="flex items-center">
                                                Tên sách
                                                {sortField === 'title' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                            onClick={() => handleSort('category')}
                                        >
                                            <div className="flex items-center">
                                                Thể loại
                                                {sortField === 'category' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                            onClick={() => handleSort('publishedYear')}
                                        >
                                            <div className="flex items-center">
                                                Năm XB
                                                {sortField === 'publishedYear' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                            onClick={() => handleSort('publisher')}
                                        >
                                            <div className="flex items-center">
                                                Nhà xuất bản
                                                {sortField === 'publisher' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                            onClick={() => handleSort('status')}
                                        >
                                            <div className="flex items-center">
                                                Trạng thái
                                                {sortField === 'status' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                            onClick={() => handleSort('availableCopies')}
                                        >
                                            <div className="flex items-center">
                                                Số lượng
                                                {sortField === 'availableCopies' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Thao tác</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center">
                                                <p className="text-gray-500">Đang tải dữ liệu...</p>
                                            </td>
                                        </tr>
                                    ) : sortedBooks.length > 0 ? (
                                        sortedBooks.map((book) => (
                                            <BookItem
                                                key={book.id}
                                                book={book}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center">
                                                <p className="text-gray-500">Không tìm thấy dữ liệu sách nào.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Book Modal */}
            {showAddModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {currentBook ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
                                        </h3>
                                        <div className="mt-4 space-y-3">
                                            <form onSubmit={handleSubmit}>
                                                <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2">
                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                                            Tên sách
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            id="title"
                                                            required
                                                            value={formData.title}
                                                            onChange={handleFormChange}
                                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                                                            Tác giả
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="author"
                                                            id="author"
                                                            required
                                                            value={formData.author}
                                                            onChange={handleFormChange}
                                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                                                            ISBN
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="isbn"
                                                            id="isbn"
                                                            value={formData.isbn}
                                                            onChange={handleFormChange}
                                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                                            Thể loại
                                                        </label>
                                                        <select
                                                            id="category"
                                                            name="category"
                                                            required
                                                            value={formData.category}
                                                            onChange={handleFormChange}
                                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        >
                                                            <option value="">Chọn thể loại</option>
                                                            <option value="programming">Lập trình</option>
                                                            <option value="data-science">Khoa học dữ liệu</option>
                                                            <option value="algorithms">Thuật toán</option>
                                                            <option value="networking">Mạng máy tính</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">
                                                            Năm xuất bản
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="publishedYear"
                                                            id="publishedYear"
                                                            value={formData.publishedYear}
                                                            onChange={handleFormChange}
                                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
                                                            Nhà xuất bản
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="publisher"
                                                            id="publisher"
                                                            value={formData.publisher}
                                                            onChange={handleFormChange}
                                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700">
                                                            Tổng số lượng
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="totalCopies"
                                                            id="totalCopies"
                                                            min="0"
                                                            required
                                                            value={formData.totalCopies}
                                                            onChange={handleFormChange}
                                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="availableCopies" className="block text-sm font-medium text-gray-700">
                                                            Số lượng hiện có
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="availableCopies"
                                                            id="availableCopies"
                                                            min="0"
                                                            max={formData.totalCopies}
                                                            required
                                                            value={formData.availableCopies}
                                                            onChange={handleFormChange}
                                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                            Mô tả
                                                        </label>
                                                        <textarea
                                                            id="description"
                                                            name="description"
                                                            rows={3}
                                                            value={formData.description}
                                                            onChange={handleFormChange}
                                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="coverimg" className="block text-sm font-medium text-gray-700">
                                                            URL ảnh bìa
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="coverimg"
                                                            id="coverimg"
                                                            value={formData.coverimg}
                                                            onChange={handleFormChange}
                                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    {currentBook ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BooksManagementClient;