'use client';

import React, { useState } from 'react';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    EyeIcon,
    CheckCircleIcon,
    ArrowUturnLeftIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ClockIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const borrowData = [
    {
        id: '1',
        borrower: 'Nguyễn Văn An',
        borrowerId: 'SV001',
        bookTitle: 'Lập Trình Python Cơ Bản',
        bookId: '1',
        borrowDate: '2023-05-01',
        dueDate: '2023-05-15',
        returnDate: '2023-05-12',
        status: 'returned', // borrowed, returned, overdue
    },
    {
        id: '2',
        borrower: 'Trần Thị Bình',
        borrowerId: 'SV002',
        bookTitle: 'Giáo Trình Java',
        bookId: '2',
        borrowDate: '2023-05-05',
        dueDate: '2023-05-19',
        returnDate: null,
        status: 'borrowed',
    },
    {
        id: '3',
        borrower: 'Lê Văn Cường',
        borrowerId: 'GV001',
        bookTitle: 'Machine Learning Cơ Bản',
        bookId: '3',
        borrowDate: '2023-04-20',
        dueDate: '2023-05-04',
        returnDate: null,
        status: 'overdue',
    },
    {
        id: '4',
        borrower: 'Phạm Thị Dung',
        borrowerId: 'SV003',
        bookTitle: 'Giải Thuật và Lập Trình',
        bookId: '4',
        borrowDate: '2023-05-10',
        dueDate: '2023-05-24',
        returnDate: null,
        status: 'borrowed',
    },
    {
        id: '5',
        borrower: 'Hoàng Văn Em',
        borrowerId: 'SV004',
        bookTitle: 'Mạng Máy Tính',
        bookId: '5',
        borrowDate: '2023-04-25',
        dueDate: '2023-05-09',
        returnDate: '2023-05-08',
        status: 'returned',
    },
];

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
};

const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const BorrowItem = ({ borrow, onReturn, onDetail }) => {
    const daysLeft = calculateDaysLeft(borrow.dueDate);

    const getStatusBadge = () => {
        switch (borrow.status) {
            case 'returned':
                return (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Đã trả
                    </span>
                );
            case 'borrowed':
                return daysLeft <= 3 ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Còn {daysLeft} ngày
                    </span>
                ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Đang mượn
                    </span>
                );
            case 'overdue':
                return (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        Quá hạn {Math.abs(daysLeft)} ngày
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{borrow.borrower}</div>
                <div className="text-sm text-gray-500">{borrow.borrowerId}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{borrow.bookTitle}</div>
                <div className="text-sm text-gray-500">ID: {borrow.bookId}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(borrow.borrowDate)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(borrow.dueDate)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {borrow.returnDate ? formatDate(borrow.returnDate) : '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => onDetail(borrow)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                    <EyeIcon className="h-5 w-5" />
                </button>
                {borrow.status === 'borrowed' || borrow.status === 'overdue' ? (
                    <button
                        onClick={() => onReturn(borrow.id)}
                        className="text-green-600 hover:text-green-900"
                    >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                    </button>
                ) : null}
            </td>
        </tr>
    );
};

const BorrowManagementClient = () => {
    const [borrows, setBorrows] = useState(borrowData);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('borrowDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [currentBorrow, setCurrentBorrow] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter borrows based on search term and status
    const filteredBorrows = borrows.filter((borrow) => {
        const matchesSearch =
            borrow.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
            borrow.borrowerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            borrow.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || borrow.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort borrows based on sort field and direction
    const sortedBorrows = [...filteredBorrows].sort((a, b) => {
        if (a[sortField] < b[sortField]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleReturn = (id) => {
        if (window.confirm('Xác nhận sách đã được trả?')) {
            setBorrows(borrows.map((borrow) =>
                borrow.id === id
                    ? {
                        ...borrow,
                        status: 'returned',
                        returnDate: new Date().toISOString().split('T')[0]
                    }
                    : borrow
            ));
        }
    };

    const handleDetail = (borrow) => {
        setCurrentBorrow(borrow);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setCurrentBorrow(null);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Quản lý mượn/trả sách</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Danh sách tất cả các giao dịch mượn/trả sách tại thư viện.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                        Đăng ký mượn sách
                    </button>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="mb-4 flex justify-between items-center">
                            <div className="relative w-64">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                    placeholder="Tìm kiếm..."
                                />
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${statusFilter === 'all'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Tất cả
                                </button>
                                <button
                                    onClick={() => setStatusFilter('borrowed')}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${statusFilter === 'borrowed'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Đang mượn
                                </button>
                                <button
                                    onClick={() => setStatusFilter('returned')}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${statusFilter === 'returned'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Đã trả
                                </button>
                                <button
                                    onClick={() => setStatusFilter('overdue')}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${statusFilter === 'overdue'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Quá hạn
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                            onClick={() => handleSort('borrower')}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                Người mượn
                                                {sortField === 'borrower' && (
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
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            onClick={() => handleSort('bookTitle')}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                Sách
                                                {sortField === 'bookTitle' && (
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
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            onClick={() => handleSort('borrowDate')}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                Ngày mượn
                                                {sortField === 'borrowDate' && (
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
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            onClick={() => handleSort('dueDate')}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                Hạn trả
                                                {sortField === 'dueDate' && (
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
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            onClick={() => handleSort('status')}
                                        >
                                            <div className="flex items-center cursor-pointer">
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
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Ngày trả
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Thao tác</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {sortedBorrows.length > 0 ? (
                                        sortedBorrows.map((borrow) => (
                                            <BorrowItem
                                                key={borrow.id}
                                                borrow={borrow}
                                                onReturn={handleReturn}
                                                onDetail={handleDetail}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                                                Không tìm thấy dữ liệu nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Borrow Modal */}
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
                                            Đăng ký mượn sách
                                        </h3>
                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <label htmlFor="borrower" className="block text-sm font-medium text-gray-700">
                                                    Người mượn
                                                </label>
                                                <input
                                                    type="text"
                                                    name="borrower"
                                                    id="borrower"
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="borrowerId" className="block text-sm font-medium text-gray-700">
                                                    Mã người mượn
                                                </label>
                                                <input
                                                    type="text"
                                                    name="borrowerId"
                                                    id="borrowerId"
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="bookId" className="block text-sm font-medium text-gray-700">
                                                    Sách
                                                </label>
                                                <select
                                                    id="bookId"
                                                    name="bookId"
                                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    <option value="">Chọn sách</option>
                                                    <option value="1">Lập Trình Python Cơ Bản</option>
                                                    <option value="2">Giáo Trình Java</option>
                                                    <option value="3">Machine Learning Cơ Bản</option>
                                                    <option value="4">Giải Thuật và Lập Trình</option>
                                                    <option value="5">Mạng Máy Tính</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="borrowDate" className="block text-sm font-medium text-gray-700">
                                                        Ngày mượn
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="borrowDate"
                                                        id="borrowDate"
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                                        Hạn trả
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="dueDate"
                                                        id="dueDate"
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                                                    Ghi chú
                                                </label>
                                                <textarea
                                                    id="note"
                                                    name="note"
                                                    rows={3}
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Đăng ký
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

            {/* Detail Modal */}
            {showDetailModal && currentBorrow && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Chi tiết mượn sách
                                        </h3>
                                        <div className="mt-4">
                                            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">Người mượn</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{currentBorrow.borrower}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Mã người mượn</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{currentBorrow.borrowerId}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                                                    <dd className="mt-1 text-sm">
                                                        {currentBorrow.status === 'returned' ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Đã trả
                                                            </span>
                                                        ) : currentBorrow.status === 'overdue' ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                Quá hạn
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                Đang mượn
                                                            </span>
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">Sách</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {currentBorrow.bookTitle} (ID: {currentBorrow.bookId})
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Ngày mượn</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(currentBorrow.borrowDate)}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Hạn trả</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(currentBorrow.dueDate)}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Ngày trả</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {currentBorrow.returnDate ? formatDate(currentBorrow.returnDate) : '—'}
                                                    </dd>
                                                </div>
                                                {currentBorrow.status === 'overdue' && (
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Số ngày quá hạn</dt>
                                                        <dd className="mt-1 text-sm text-red-600">
                                                            {Math.abs(calculateDaysLeft(currentBorrow.dueDate))} ngày
                                                        </dd>
                                                    </div>
                                                )}
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                {(currentBorrow.status === 'borrowed' || currentBorrow.status === 'overdue') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleReturn(currentBorrow.id);
                                            handleCloseDetailModal();
                                        }}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        <ArrowUturnLeftIcon className="h-5 w-5 mr-1" />
                                        Cập nhật trả sách
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleCloseDetailModal}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BorrowManagementClient;
