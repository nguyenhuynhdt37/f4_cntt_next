'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    BookOpenIcon,
    EyeIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';

// In a real implementation, this would come from an API
const mockBooksData = [
    {
        id: 1,
        title: 'Lập trình với Python',
        author: 'Nguyễn Văn A',
        publisher: 'NXB Giáo dục',
        category: 'Công nghệ thông tin',
        publishDate: '2023-05-15',
        isbn: '9781234567897',
        quantity: 5,
        availableQuantity: 3,
        coverImage: '/slides/slide1.jpg',
        location: 'Kệ A-12',
    },
    {
        id: 2,
        title: 'Cơ sở dữ liệu',
        author: 'Trần Thị B',
        publisher: 'NXB Bách khoa',
        category: 'Công nghệ thông tin',
        publishDate: '2022-10-08',
        isbn: '9781234567898',
        quantity: 8,
        availableQuantity: 6,
        coverImage: '/slides/slide2.jpg',
        location: 'Kệ B-05',
    },
    {
        id: 3,
        title: 'Giải thuật và Cấu trúc dữ liệu',
        author: 'Lê Văn C',
        publisher: 'NXB ĐHQG TPHCM',
        category: 'Công nghệ thông tin',
        publishDate: '2021-03-21',
        isbn: '9781234567899',
        quantity: 10,
        availableQuantity: 7,
        coverImage: '/slides/slide3.jpg',
        location: 'Kệ A-14',
    }
];

type Book = {
    id: number;
    title: string;
    author: string;
    publisher: string;
    category: string;
    publishDate: string;
    isbn: string;
    quantity: number;
    availableQuantity: number;
    coverImage: string;
    location: string;
};

type SortField = 'title' | 'author' | 'publisher' | 'category' | 'publishDate' | 'quantity' | 'availableQuantity';

export default function BooksList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('title');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [deletingBookId, setDeletingBookId] = useState<number | null>(null);
    const pageSize = 10;

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                // In a real implementation, this would be an API call
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Simulate filtering based on search query
                let filteredBooks = [...mockBooksData];
                if (searchQuery) {
                    filteredBooks = mockBooksData.filter(book =>
                        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        book.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        book.isbn.includes(searchQuery)
                    );
                }

                // Simulate sorting
                filteredBooks.sort((a, b) => {
                    const fieldA = a[sortField];
                    const fieldB = b[sortField];

                    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
                    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });

                // Simulate pagination
                const startIndex = (currentPage - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

                setBooks(paginatedBooks);
                setTotalItems(filteredBooks.length);
                setTotalPages(Math.ceil(filteredBooks.length / pageSize));
            } catch (err) {
                console.error('Lỗi khi tải danh sách sách:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, [currentPage, searchQuery, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;
    };

    const handleDelete = async (bookId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
            return;
        }

        try {
            setDeletingBookId(bookId);

            // In a real implementation, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

            setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
            alert('Xóa sách thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa sách:', error);
            alert('Có lỗi xảy ra khi xóa sách');
        } finally {
            setDeletingBookId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header và actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpenIcon className="h-6 w-6 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý Sách</h1>
                        </div>
                        <p className="text-sm text-gray-600">
                            Quản lý kho sách vật lý trong thư viện
                        </p>
                    </div>
                    <Link
                        href="/admin/library/books/add"
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>Thêm sách mới</span>
                    </Link>
                </div>

                {/* Tìm kiếm */}
                <div className="mt-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Tìm kiếm theo tên sách, tác giả, nhà xuất bản, ISBN..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Danh sách sách */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <span>Ảnh bìa</span>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('title')}
                                >
                                    <div className="flex items-center">
                                        <span>Tên sách</span>
                                        {getSortIcon('title')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('author')}
                                >
                                    <div className="flex items-center">
                                        <span>Tác giả</span>
                                        {getSortIcon('author')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('category')}
                                >
                                    <div className="flex items-center">
                                        <span>Danh mục</span>
                                        {getSortIcon('category')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('quantity')}
                                >
                                    <div className="flex items-center">
                                        <span>SL</span>
                                        {getSortIcon('quantity')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('availableQuantity')}
                                >
                                    <div className="flex items-center">
                                        <span>Còn lại</span>
                                        {getSortIcon('availableQuantity')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('location')}
                                >
                                    <div className="flex items-center">
                                        <span>Vị trí</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                                            <div>Đang tải...</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : books.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                        {searchQuery ? 'Không tìm thấy sách nào phù hợp.' : 'Chưa có sách nào trong hệ thống.'}
                                    </td>
                                </tr>
                            ) : (
                                books.map(book => (
                                    <tr key={book.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-16 w-12 relative">
                                                <Image
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover rounded"
                                                    sizes="48px"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                            <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{book.author}</div>
                                            <div className="text-xs text-gray-500">{book.publisher}</div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {book.category}
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            {book.quantity}
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${book.availableQuantity > 0
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {book.availableQuantity}
                                            </span>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {book.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={`/admin/library/books/view/${book.id}`} className="text-indigo-600 hover:text-indigo-900" title="Xem chi tiết">
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>
                                                <Link href={`/admin/library/books/edit/${book.id}`} className="text-blue-600 hover:text-blue-900" title="Chỉnh sửa">
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(book.id)}
                                                    className={`text-red-600 hover:text-red-900 ${deletingBookId === book.id ? 'opacity-50 cursor-wait' : ''}`}
                                                    disabled={deletingBookId === book.id}
                                                    title="Xóa"
                                                >
                                                    {deletingBookId === book.id ? (
                                                        <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full border-current"></div>
                                                    ) : (
                                                        <TrashIcon className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex items-center justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Trước
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Sau
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> trong số <span className="font-medium">{totalItems}</span> cuốn sách
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="sr-only">Trang trước</span>
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>

                                    {/* Page numbers */}
                                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                        let pageNum: number;

                                        // Logic to show appropriate page numbers
                                        if (totalPages <= 5) {
                                            pageNum = index + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = index + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + index;
                                        } else {
                                            pageNum = currentPage - 2 + index;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="sr-only">Trang sau</span>
                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
