'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    BookOpenIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

type BorrowRecord = {
    id: number;
    bookId: number;
    bookTitle: string;
    bookISBN: string;
    userId: number;
    userName: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: 'borrowed' | 'returned' | 'overdue'; // borrowed = đang mượn, returned = đã trả, overdue = quá hạn
    notes: string | null;
};

// Example data for UI development
const mockBorrowRecords: BorrowRecord[] = [
    {
        id: 1,
        bookId: 101,
        bookTitle: 'Lập trình với Python',
        bookISBN: '9781234567897',
        userId: 201,
        userName: 'Nguyễn Văn A',
        borrowDate: '2025-05-01',
        dueDate: '2025-05-15',
        returnDate: null,
        status: 'borrowed',
        notes: null,
    },
    {
        id: 2,
        bookId: 102,
        bookTitle: 'Cơ sở dữ liệu',
        bookISBN: '9781234567898',
        userId: 202,
        userName: 'Trần Thị B',
        borrowDate: '2025-04-15',
        dueDate: '2025-04-29',
        returnDate: null,
        status: 'overdue',
        notes: 'Đã liên hệ nhắc nhở',
    },
    {
        id: 3,
        bookId: 103,
        bookTitle: 'Giải thuật và Cấu trúc dữ liệu',
        bookISBN: '9781234567899',
        userId: 203,
        userName: 'Lê Văn C',
        borrowDate: '2025-04-20',
        dueDate: '2025-05-04',
        returnDate: '2025-05-02',
        status: 'returned',
        notes: 'Trả đúng hạn',
    },
];

type SortField = 'bookTitle' | 'userName' | 'borrowDate' | 'dueDate' | 'returnDate' | 'status';

export default function BorrowRecordsList() {
    const [records, setRecords] = useState<BorrowRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('borrowDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const pageSize = 10;

    // Process records on initial load and when filters/sort change
    useEffect(() => {
        const fetchRecords = async () => {
            setIsLoading(true);
            try {
                // In a real implementation, this would be an API call
                // For now, simulating data fetching with some delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Filter by status if needed
                let filteredRecords = [...mockBorrowRecords];
                if (statusFilter !== 'all') {
                    filteredRecords = mockBorrowRecords.filter(record => record.status === statusFilter);
                }

                // Filter by search query
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    filteredRecords = filteredRecords.filter(record =>
                        record.bookTitle.toLowerCase().includes(query) ||
                        record.bookISBN.includes(query) ||
                        record.userName.toLowerCase().includes(query)
                    );
                }

                // Sort records
                filteredRecords.sort((a, b) => {
                    let fieldA = a[sortField];
                    let fieldB = b[sortField];

                    // Handle null values for returnDate
                    if (sortField === 'returnDate') {
                        if (fieldA === null && fieldB === null) return 0;
                        if (fieldA === null) return sortDirection === 'asc' ? 1 : -1;
                        if (fieldB === null) return sortDirection === 'asc' ? -1 : 1;
                    }

                    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
                    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });

                // Paginate
                const startIndex = (currentPage - 1) * pageSize;
                const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

                setRecords(paginatedRecords);
                setTotalItems(filteredRecords.length);
                setTotalPages(Math.ceil(filteredRecords.length / pageSize));
            } catch (error) {
                console.error('Error fetching borrow records:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecords();
    }, [searchQuery, sortField, sortDirection, currentPage, statusFilter]);

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

    const handleReturnBook = async (recordId: number) => {
        if (!window.confirm('Xác nhận sách đã được trả?')) {
            return;
        }

        try {
            // In a real implementation, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

            // Update the record locally
            setRecords(prevRecords =>
                prevRecords.map(record =>
                    record.id === recordId
                        ? {
                            ...record,
                            status: 'returned',
                            returnDate: new Date().toISOString().split('T')[0]
                        }
                        : record
                )
            );

            alert('Đã cập nhật trạng thái sách thành công!');
        } catch (error) {
            console.error('Error updating book return status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái trả sách');
        }
    };

    // Helper function to format dates
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—';

        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    };

    // Helper function to get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'borrowed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <ClockIcon className="mr-1 h-3 w-3" />
                        Đang mượn
                    </span>
                );
            case 'returned':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="mr-1 h-3 w-3" />
                        Đã trả
                    </span>
                );
            case 'overdue':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircleIcon className="mr-1 h-3 w-3" />
                        Quá hạn
                    </span>
                );
            default:
                return null;
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
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý Mượn/Trả</h1>
                        </div>
                        <p className="text-sm text-gray-600">
                            Quản lý việc mượn và trả sách của thư viện
                        </p>
                    </div>
                    <Link
                        href="/admin/library/borrow/new"
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Thêm lượt mượn</span>
                    </Link>
                </div>

                {/* Filters and Search */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status filter */}
                    <div>
                        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="borrowed">Đang mượn</option>
                            <option value="returned">Đã trả</option>
                            <option value="overdue">Quá hạn</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="md:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="search"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Tìm kiếm theo tên sách, người mượn, ISBN..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách mượn/trả */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('bookTitle')}
                                >
                                    <div className="flex items-center">
                                        <span>Sách</span>
                                        {getSortIcon('bookTitle')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('userName')}
                                >
                                    <div className="flex items-center">
                                        <span>Người mượn</span>
                                        {getSortIcon('userName')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('borrowDate')}
                                >
                                    <div className="flex items-center">
                                        <span>Ngày mượn</span>
                                        {getSortIcon('borrowDate')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('dueDate')}
                                >
                                    <div className="flex items-center">
                                        <span>Hạn trả</span>
                                        {getSortIcon('dueDate')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('returnDate')}
                                >
                                    <div className="flex items-center">
                                        <span>Ngày trả</span>
                                        {getSortIcon('returnDate')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center">
                                        <span>Trạng thái</span>
                                        {getSortIcon('status')}
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
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                                            <div>Đang tải...</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                        {searchQuery || statusFilter !== 'all'
                                            ? 'Không tìm thấy lượt mượn/trả nào phù hợp với điều kiện tìm kiếm.'
                                            : 'Chưa có lượt mượn/trả nào trong hệ thống.'}
                                    </td>
                                </tr>
                            ) : (
                                records.map(record => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <BookOpenIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-1.5" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{record.bookTitle}</div>
                                                    <div className="text-xs text-gray-500">ISBN: {record.bookISBN}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-1.5" />
                                                <div className="text-sm text-gray-900">{record.userName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(record.borrowDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(record.dueDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(record.returnDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(record.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {(record.status === 'borrowed' || record.status === 'overdue') && (
                                                    <button
                                                        onClick={() => handleReturnBook(record.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Đánh dấu đã trả"
                                                    >
                                                        <CheckCircleIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/admin/library/borrow/${record.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Xem chi tiết"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                    </svg>
                                                </Link>
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
                                    Hiển thị <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> trong số <span className="font-medium">{totalItems}</span> lượt mượn/trả
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
