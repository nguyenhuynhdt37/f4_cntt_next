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
    UserIcon,
    CalendarDaysIcon,
    PlusIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ArrowTopRightOnSquareIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';
import { getTransactions } from '@/api/axios/transactions';
import { formatCurrency, formatDateTime } from '@/utils/formatter';

type Transaction = {
    id: number;
    transactionCode: string;
    amount: number;
    status: string;
    createdAt: string;
    userId: number;
    username: string;
    userEmail: string;
    packageId: number;
    package: string;
};

export default function TransactionsList() {
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

    // Fetch data
    const fetchTransactions = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await getTransactions({
                page: currentPage,
                size: pageSize,
                search: searchTerm,
                sortField: sortBy,
                sortDirection: sortDir
            });

            setTransactions(response.items);
            setTotalItems(response.totalItems);
            setTotalPages(response.totalPages);
        } catch (err: any) {
            console.error('Error fetching transactions:', err);
            setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load and when dependencies change
    useEffect(() => {
        fetchTransactions();
    }, [currentPage, pageSize, searchTerm, sortBy, sortDir]);

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
                        <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                            Thành công
                        </span>
                    </div>
                );
            case 'pending':
                return (
                    <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                            Đang xử lý
                        </span>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center">
                        <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                        <span className="px-2 py-1 text-sm rounded-full bg-red-100 text-red-800">
                            Thất bại
                        </span>
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                            Đã hủy
                        </span>
                    </div>
                );
            default:
                return (
                    <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-t-2xl px-8 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                        <div className="bg-white/20 rounded-lg p-2">
                            <CreditCardIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Giao dịch thanh toán</h1>
                            <p className="text-blue-100">Quản lý tất cả giao dịch thanh toán trên hệ thống</p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => fetchTransactions()}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
                        >
                            <ArrowPathIcon className="h-4 w-4" />
                            <span>Làm mới</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <form onSubmit={handleSearch} className="w-full md:w-96">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm theo mã giao dịch, tên, email..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={searchInputValue}
                                onChange={(e) => setSearchInputValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 px-3 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 focus:outline-none"
                            >
                                Tìm
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center space-x-2">
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value="10">10 hàng</option>
                            <option value="20">20 hàng</option>
                            <option value="50">50 hàng</option>
                            <option value="100">100 hàng</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Mã giao dịch
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Gói dịch vụ
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Người dùng
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Chi tiết
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full bg-red-100 p-3 mb-4">
                                            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 font-medium mb-1">Đã xảy ra lỗi</p>
                                        <p className="text-red-500">{error}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full bg-gray-100 p-3 mb-4">
                                            <CreditCardIcon className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-1">Không có dữ liệu</p>
                                        <p className="text-gray-400">Không tìm thấy giao dịch nào phù hợp với tiêu chí</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{transaction.transactionCode}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{formatCurrency(transaction.amount)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(transaction.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link href={`/admin/packages/${transaction.packageId}`} className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline">
                                            <span>{transaction.package}</span>
                                            <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                <UserIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{transaction.username}</div>
                                                <div className="text-sm text-gray-500">{transaction.userEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                                            {formatDateTime(transaction.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link href={`/admin/transactions/${transaction.id}`} className="text-indigo-600 hover:text-indigo-800 hover:underline">
                                            Xem chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                            Hiển thị <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> trong <span className="font-medium">{totalItems}</span> kết quả
                        </p>
                    </div>

                    <div className="flex-1 flex justify-center sm:justify-end">
                        <nav className="relative z-0 inline-flex shadow-sm rounded-md space-x-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm font-medium transform transition-all duration-200 ${currentPage === 1
                                    ? 'text-gray-300 cursor-not-allowed border-gray-200 bg-gray-50'
                                    : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 border-gray-300 bg-white'
                                    }`}
                            >
                                <span className="sr-only">Trước</span>
                                <ChevronLeftIcon className="h-5 w-5" />
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
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transform transition-all duration-200 ${currentPage === pageNumber
                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
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
                                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border text-sm font-medium transform transition-all duration-200 ${currentPage === totalPages
                                    ? 'text-gray-300 cursor-not-allowed border-gray-200 bg-gray-50'
                                    : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 border-gray-300 bg-white'
                                    }`}
                            >
                                <span className="sr-only">Sau</span>
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
} 