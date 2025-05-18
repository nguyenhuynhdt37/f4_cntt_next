'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    CreditCardIcon,
    ArrowPathIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { getUserTransactions } from '@/api/axios/transactions';
import { formatCurrency, formatDateTime } from '@/utils/formatter';

type Transaction = {
    id: number;
    transactionCode: string;
    amount: number;
    status: string;
    createdAt: string;
    type: string;
    packageName?: string;
    points?: number;
};

export default function TransactionList() {
    // State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Sorting & Filtering
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInputValue, setSearchInputValue] = useState('');
    const [selectedType, setSelectedType] = useState<string>('');

    // Fetch data
    const fetchTransactions = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await getUserTransactions({
                page: currentPage,
                size: pageSize,
                search: searchTerm,
                type: selectedType || undefined,
                sortField: sortBy,
                sortDirection: sortDir
            });

            setTransactions(response.items || []);
            setTotalItems(response.totalItems || 0);
            setTotalPages(response.totalPages || 1);
        } catch (err: any) {
            console.error('Error fetching user transactions:', err);
            setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu giao dịch');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load and when dependencies change
    useEffect(() => {
        fetchTransactions();
    }, [currentPage, pageSize, searchTerm, sortBy, sortDir, selectedType]);

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page
        setSearchTerm(searchInputValue);
    };

    // Handle sort
    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDir('desc');
        }
        setCurrentPage(1);
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return (
                    <div className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Thành công
                        </span>
                    </div>
                );
            case 'pending':
                return (
                    <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Đang xử lý
                        </span>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center">
                        <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Thất bại
                        </span>
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            Đã hủy
                        </span>
                    </div>
                );
            default:
                return (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    // Get transaction type badge
    const getTypeBadge = (type: string) => {
        switch (type.toLowerCase()) {
            case 'deposit':
                return (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Nạp tiền
                    </span>
                );
            case 'exchange':
                return (
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        Đổi điểm
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {type}
                    </span>
                );
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-t-2xl px-6 py-5">
                <div className="flex items-center">
                    <div className="bg-white/20 rounded-lg p-2 mr-4">
                        <CreditCardIcon className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white">Lịch sử giao dịch</h1>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <form onSubmit={handleSearch} className="w-full md:w-64">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm giao dịch..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchInputValue}
                                onChange={(e) => setSearchInputValue(e.target.value)}
                            />
                        </div>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => fetchTransactions()}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                            <span>Làm mới</span>
                        </button>

                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Tất cả loại giao dịch</option>
                            <option value="deposit">Nạp tiền</option>
                            <option value="exchange">Đổi điểm</option>
                        </select>

                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value="5">5 hàng</option>
                            <option value="10">10 hàng</option>
                            <option value="20">20 hàng</option>
                            <option value="50">50 hàng</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Mã giao dịch
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('type')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Loại giao dịch</span>
                                    {sortBy === 'type' && (
                                        sortDir === 'asc' ?
                                            <ChevronUpIcon className="h-4 w-4" /> :
                                            <ChevronDownIcon className="h-4 w-4" />
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('amount')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Số tiền</span>
                                    {sortBy === 'amount' && (
                                        sortDir === 'asc' ?
                                            <ChevronUpIcon className="h-4 w-4" /> :
                                            <ChevronDownIcon className="h-4 w-4" />
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Trạng thái
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('createdAt')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Thời gian</span>
                                    {sortBy === 'createdAt' && (
                                        sortDir === 'asc' ?
                                            <ChevronUpIcon className="h-4 w-4" /> :
                                            <ChevronDownIcon className="h-4 w-4" />
                                    )}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-sm text-gray-500">Đang tải dữ liệu giao dịch...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full bg-red-100 p-2 mb-3">
                                            <XCircleIcon className="h-5 w-5 text-red-500" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">Đã xảy ra lỗi</p>
                                        <p className="text-sm text-red-500">{error}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full bg-gray-100 p-3 mb-3">
                                            <CreditCardIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Không có dữ liệu</p>
                                        <p className="text-sm text-gray-400">Bạn chưa có giao dịch nào</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <Link href={`/transaction_history/${transaction.id}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                                            {transaction.transactionCode}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {getTypeBadge(transaction.type)}
                                        <div className="text-xs text-gray-500 mt-1">
                                            {transaction.packageName && `Gói: ${transaction.packageName}`}
                                            {transaction.points && `Điểm: ${transaction.points}`}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatCurrency(transaction.amount)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {getStatusBadge(transaction.status)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <CalendarDaysIcon className="h-3 w-3 mr-1 text-gray-400" />
                                            {formatDateTime(transaction.createdAt)}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="hidden sm:block">
                        <p className="text-xs text-gray-700">
                            Hiển thị <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> trong <span className="font-medium">{totalItems}</span> kết quả
                        </p>
                    </div>

                    <div className="flex-1 flex justify-center sm:justify-end">
                        <nav className="relative z-0 inline-flex shadow-sm rounded-md -space-x-px">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${currentPage === 1
                                    ? 'text-gray-300 cursor-not-allowed border-gray-200 bg-gray-50'
                                    : 'text-gray-500 hover:bg-gray-50 border-gray-300 bg-white'
                                    }`}
                            >
                                <span className="sr-only">Trước</span>
                                <ChevronLeftIcon className="h-4 w-4" />
                            </button>

                            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                                let pageNumber;

                                if (totalPages <= 5) {
                                    pageNumber = idx + 1;
                                } else if (currentPage <= 3) {
                                    pageNumber = idx + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + idx;
                                } else {
                                    pageNumber = currentPage - 2 + idx;
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${currentPage === pageNumber
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${currentPage === totalPages
                                    ? 'text-gray-300 cursor-not-allowed border-gray-200 bg-gray-50'
                                    : 'text-gray-500 hover:bg-gray-50 border-gray-300 bg-white'
                                    }`}
                            >
                                <span className="sr-only">Sau</span>
                                <ChevronRightIcon className="h-4 w-4" />
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
