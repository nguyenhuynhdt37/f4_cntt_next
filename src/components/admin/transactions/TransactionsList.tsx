'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowPathIcon,
    MagnifyingGlassIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FunnelIcon,
    DocumentArrowDownIcon,
    EyeIcon,
    XMarkIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// Mock data for development
const mockTransactions = Array(30).fill(null).map((_, index) => ({
    id: index + 1,
    userId: Math.floor(Math.random() * 100) + 1,
    userName: `Người dùng ${index % 10 + 1}`,
    userEmail: `user${index % 10 + 1}@example.com`,
    amount: Math.floor(Math.random() * 1000000) / 100,
    type: ['deposit', 'withdrawal', 'payment', 'refund', 'subscription'][Math.floor(Math.random() * 5)],
    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
    description: [
        'Nạp tiền vào tài khoản',
        'Rút tiền từ tài khoản',
        'Thanh toán khóa học',
        'Thanh toán phí thành viên',
        'Hoàn tiền khóa học',
        'Thanh toán phí trễ hạn',
        'Mua tài liệu',
    ][Math.floor(Math.random() * 7)],
    reference: `REF-${Math.floor(Math.random() * 10000)}`,
    referenceType: ['book', 'document', 'subscription', 'membership'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString(),
}));

const TransactionsList: React.FC = () => {
    // State for pagination, sorting, and filtering
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState<{
        startDate: string | null;
        endDate: string | null;
    }>({
        startDate: null,
        endDate: null,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<typeof mockTransactions>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    // Types and statuses for filtering
    const transactionTypes = ['all', 'deposit', 'withdrawal', 'payment', 'refund', 'subscription'];
    const transactionStatuses = ['all', 'completed', 'pending', 'failed'];

    // Get and format transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // In a real app, this would be an API call with filters
                setIsLoading(true);

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                let filteredTransactions = [...mockTransactions];

                // Apply search filter
                if (searchTerm.trim()) {
                    filteredTransactions = filteredTransactions.filter(
                        trans =>
                            trans.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            trans.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            trans.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            trans.reference.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                // Apply type filter
                if (typeFilter !== 'all') {
                    filteredTransactions = filteredTransactions.filter(
                        trans => trans.type === typeFilter
                    );
                }

                // Apply status filter
                if (statusFilter !== 'all') {
                    filteredTransactions = filteredTransactions.filter(
                        trans => trans.status === statusFilter
                    );
                }

                // Apply date range filter
                if (dateRange.startDate) {
                    filteredTransactions = filteredTransactions.filter(
                        trans => new Date(trans.createdAt) >= new Date(dateRange.startDate!)
                    );
                }

                if (dateRange.endDate) {
                    filteredTransactions = filteredTransactions.filter(
                        trans => new Date(trans.createdAt) <= new Date(dateRange.endDate!)
                    );
                }

                // Apply sorting
                filteredTransactions.sort((a, b) => {
                    const aValue = a[sortField as keyof typeof a];
                    const bValue = b[sortField as keyof typeof b];

                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        return sortDirection === 'asc'
                            ? aValue.localeCompare(bValue)
                            : bValue.localeCompare(aValue);
                    }

                    // Numeric sort
                    if (typeof aValue === 'number' && typeof bValue === 'number') {
                        return sortDirection === 'asc'
                            ? aValue - bValue
                            : bValue - aValue;
                    }

                    // Date sort
                    if (sortField === 'createdAt' || sortField === 'updatedAt') {
                        return sortDirection === 'asc'
                            ? new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
                            : new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime();
                    }

                    return 0;
                });

                setTotalItems(filteredTransactions.length);

                // Paginate
                const paginatedTransactions = filteredTransactions.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                );

                setTransactions(paginatedTransactions);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [currentPage, itemsPerPage, sortField, sortDirection, searchTerm, typeFilter, statusFilter, dateRange]);

    // Calculate total pages
    const totalPages = useMemo(() => Math.ceil(totalItems / itemsPerPage), [totalItems, itemsPerPage]);

    // Handle sorting
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Hoàn thành
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Đang xử lý
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Thất bại
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    // Get transaction type label
    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'deposit':
                return 'Nạp tiền';
            case 'withdrawal':
                return 'Rút tiền';
            case 'payment':
                return 'Thanh toán';
            case 'refund':
                return 'Hoàn tiền';
            case 'subscription':
                return 'Đăng ký';
            default:
                return type;
        }
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setTypeFilter('all');
        setStatusFilter('all');
        setDateRange({ startDate: null, endDate: null });
        setCurrentPage(1);
    };

    // Handle export
    const handleExport = () => {
        // In a real app, this would call the API to export data
        alert('Chức năng xuất dữ liệu sẽ được triển khai sau khi kết nối API');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header and search */}
            <div className="px-6 py-5 border-b border-gray-200 flex flex-wrap gap-4 justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Lịch sử giao dịch</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Xem lịch sử giao dịch của tất cả người dùng hệ thống
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full md:w-60 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </span>
                    </form>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center transition-colors"
                    >
                        <FunnelIcon className="h-4 w-4 mr-1" />
                        Bộ lọc
                    </button>

                    <button
                        onClick={handleExport}
                        className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center transition-colors"
                    >
                        <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                        Xuất Excel
                    </button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Bộ lọc nâng cao</h3>
                        <button
                            onClick={resetFilters}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Đặt lại bộ lọc
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Loại giao dịch
                            </label>
                            <select
                                id="typeFilter"
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm"
                            >
                                {transactionTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type === 'all' ? 'Tất cả' : getTypeLabel(type)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm"
                            >
                                {transactionStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status === 'all'
                                            ? 'Tất cả'
                                            : status === 'completed'
                                                ? 'Hoàn thành'
                                                : status === 'pending'
                                                    ? 'Đang xử lý'
                                                    : 'Thất bại'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={dateRange.startDate || ''}
                                onChange={(e) => {
                                    setDateRange({ ...dateRange, startDate: e.target.value || null });
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={dateRange.endDate || ''}
                                onChange={(e) => {
                                    setDateRange({ ...dateRange, endDate: e.target.value || null });
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm"
                            />
                        </div>
                    </div>

                    {/* Active filters */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {typeFilter !== 'all' && (
                            <div className="bg-blue-50 text-blue-800 text-xs py-1 px-2 rounded-full flex items-center">
                                <span className="mr-1">Loại: {getTypeLabel(typeFilter)}</span>
                                <button
                                    onClick={() => {
                                        setTypeFilter('all');
                                        setCurrentPage(1);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </div>
                        )}

                        {statusFilter !== 'all' && (
                            <div className="bg-blue-50 text-blue-800 text-xs py-1 px-2 rounded-full flex items-center">
                                <span className="mr-1">
                                    Trạng thái: {
                                        statusFilter === 'completed'
                                            ? 'Hoàn thành'
                                            : statusFilter === 'pending'
                                                ? 'Đang xử lý'
                                                : 'Thất bại'
                                    }
                                </span>
                                <button
                                    onClick={() => {
                                        setStatusFilter('all');
                                        setCurrentPage(1);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </div>
                        )}

                        {dateRange.startDate && (
                            <div className="bg-blue-50 text-blue-800 text-xs py-1 px-2 rounded-full flex items-center">
                                <span className="mr-1">
                                    Từ ngày: {format(new Date(dateRange.startDate), 'dd/MM/yyyy')}
                                </span>
                                <button
                                    onClick={() => {
                                        setDateRange({ ...dateRange, startDate: null });
                                        setCurrentPage(1);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </div>
                        )}

                        {dateRange.endDate && (
                            <div className="bg-blue-50 text-blue-800 text-xs py-1 px-2 rounded-full flex items-center">
                                <span className="mr-1">
                                    Đến ngày: {format(new Date(dateRange.endDate), 'dd/MM/yyyy')}
                                </span>
                                <button
                                    onClick={() => {
                                        setDateRange({ ...dateRange, endDate: null });
                                        setCurrentPage(1);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Transactions table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('id')}
                            >
                                <div className="flex items-center">
                                    Mã giao dịch
                                    {sortField === 'id' && (
                                        sortDirection === 'asc' ? (
                                            <ChevronUpIcon className="h-4 w-4 ml-1" />
                                        ) : (
                                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('userName')}
                            >
                                <div className="flex items-center">
                                    Người dùng
                                    {sortField === 'userName' && (
                                        sortDirection === 'asc' ? (
                                            <ChevronUpIcon className="h-4 w-4 ml-1" />
                                        ) : (
                                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('amount')}
                            >
                                <div className="flex items-center">
                                    Số tiền
                                    {sortField === 'amount' && (
                                        sortDirection === 'asc' ? (
                                            <ChevronUpIcon className="h-4 w-4 ml-1" />
                                        ) : (
                                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('type')}
                            >
                                <div className="flex items-center">
                                    Loại
                                    {sortField === 'type' && (
                                        sortDirection === 'asc' ? (
                                            <ChevronUpIcon className="h-4 w-4 ml-1" />
                                        ) : (
                                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center">
                                    Trạng thái
                                    {sortField === 'status' && (
                                        sortDirection === 'asc' ? (
                                            <ChevronUpIcon className="h-4 w-4 ml-1" />
                                        ) : (
                                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('createdAt')}
                            >
                                <div className="flex items-center">
                                    Thời gian
                                    {sortField === 'createdAt' && (
                                        sortDirection === 'asc' ? (
                                            <ChevronUpIcon className="h-4 w-4 ml-1" />
                                        ) : (
                                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            // Loading skeleton
                            Array(itemsPerPage)
                                .fill(null)
                                .map((_, index) => (
                                    <tr key={index}>
                                        {Array(7)
                                            .fill(null)
                                            .map((_, cellIndex) => (
                                                <td key={cellIndex} className="px-6 py-4">
                                                    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                                                </td>
                                            ))}
                                    </tr>
                                ))
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center">
                                    <p className="text-gray-500 text-base">Không có dữ liệu giao dịch</p>
                                    <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc để tìm kiếm kết quả khác</p>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            #{transaction.id}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {transaction.reference}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {transaction.userName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {transaction.userEmail}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-semibold ${transaction.type === 'deposit' || transaction.type === 'refund'
                                                ? 'text-green-600'
                                                : transaction.type === 'withdrawal' || transaction.type === 'payment'
                                                    ? 'text-red-600'
                                                    : 'text-gray-900'
                                            }`}>
                                            {(transaction.type === 'deposit' || transaction.type === 'refund') && '+'}
                                            {(transaction.type === 'withdrawal' || transaction.type === 'payment') && '-'}
                                            {formatCurrency(transaction.amount)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {getTypeLabel(transaction.type)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(transaction.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {format(new Date(transaction.createdAt), 'dd/MM/yyyy')}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {format(new Date(transaction.createdAt), 'HH:mm')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                            title="Xem chi tiết"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{transactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến{' '}
                    <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{' '}
                    trong tổng số <span className="font-medium">{totalItems}</span> kết quả
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Calculate the page number to show
                        let pageToShow = currentPage;
                        if (currentPage < 3) {
                            pageToShow = i + 1;
                        } else if (currentPage > totalPages - 2) {
                            pageToShow = totalPages - 4 + i;
                        } else {
                            pageToShow = currentPage - 2 + i;
                        }

                        // Ensure the page is in bounds
                        if (pageToShow > 0 && pageToShow <= totalPages) {
                            return (
                                <button
                                    key={pageToShow}
                                    onClick={() => setCurrentPage(pageToShow)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === pageToShow
                                            ? 'bg-blue-600 text-white border border-blue-600'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageToShow}
                                </button>
                            );
                        }
                        return null;
                    })}
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionsList;
