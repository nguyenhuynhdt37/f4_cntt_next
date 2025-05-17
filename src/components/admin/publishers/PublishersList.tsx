'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { getListPublisher, deletePublisher } from '@/api/axios/publishers';

type Publisher = {
    id: number;
    name: string;
    booksCount: number;
    createdAt: string;
};

export default function PublishersList() {
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof Publisher>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [deletingPublisherId, setDeletingPublisherId] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        const fetchPublishers = async () => {
            setIsLoading(true);
            try {
                const res = await getListPublisher({
                    page: currentPage,
                    size: pageSize,
                    search: searchQuery,
                    sortDirection: sortDirection,
                    sortField: sortField
                });
                setPublishers(res.items);
                setTotalPages(res.totalPages);
                setTotalItems(res.totalItems);
            } catch (err) {
                console.error('Lỗi khi tải danh sách nhà xuất bản:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublishers();
    }, [currentPage, searchQuery, sortField, sortDirection]);

    const handleSort = (field: keyof Publisher) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: keyof Publisher) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;
    };

    const confirmDelete = (publisherId: number) => {
        setDeletingPublisherId(publisherId);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        if (!deletingPublisherId) return;

        try {
            await deletePublisher(deletingPublisherId);

            // Xóa nhà xuất bản khỏi danh sách
            const updatedPublishers = publishers.filter(publisher => publisher.id !== deletingPublisherId);
            setPublishers(updatedPublishers);

            setShowDeleteConfirm(false);
            alert('Xóa nhà xuất bản thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa nhà xuất bản:', error);
            alert('Có lỗi xảy ra khi xóa nhà xuất bản');
        } finally {
            setDeletingPublisherId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header và actions */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl shadow-sm mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý nhà xuất bản</h1>
                        </div>
                        <p className="text-gray-600 pl-10">Quản lý tất cả nhà xuất bản trong hệ thống</p>
                    </div>
                    <Link
                        href="/admin/publishers/add"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-teal-700 transform transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Thêm nhà xuất bản
                    </Link>
                </div>
            </div>

            {/* Filter và search */}
            <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhà xuất bản theo tên..."
                            value={searchQuery}
                            onChange={e => {
                                setCurrentPage(1); // reset về trang đầu khi tìm kiếm
                                setSearchQuery(e.target.value);
                            }}
                            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
                        <div className="bg-green-100 text-green-800 p-1.5 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <span>Tổng số: <strong>{totalItems}</strong> nhà xuất bản</span>
                    </div>
                </div>
            </div>

            {/* Trạng thái loading */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[40vh] bg-white rounded-xl shadow-sm">
                    <div className="relative w-20 h-20">
                        <div className="w-20 h-20 rounded-full border-4 border-green-200"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 text-gray-500 font-medium text-xl">Đang tải danh sách nhà xuất bản...</p>
                    <p className="text-gray-400 italic mt-2">Vui lòng đợi trong giây lát</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('id')}>
                                        <div className="flex items-center gap-1">
                                            <span>ID</span>
                                            {getSortIcon('id')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                                        <div className="flex items-center gap-1">
                                            <span>Tên nhà xuất bản</span>
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('booksCount')}>
                                        <div className="flex items-center gap-1">
                                            <span>Số sách</span>
                                            {getSortIcon('booksCount')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {publishers.length > 0 ? (
                                    publishers.map((publisher) => (
                                        <tr key={publisher.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {publisher.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-green-100 text-green-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{publisher.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="text-teal-600 p-1.5 rounded-full bg-teal-100 mr-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm text-gray-900">{publisher.booksCount || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={`/admin/publishers/edit/${publisher.id}`}
                                                        className="text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 p-1.5 rounded-md transition-colors"
                                                        title="Sửa"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </Link>

                                                    <button
                                                        disabled={publisher.booksCount > 0}
                                                        onClick={() => confirmDelete(publisher.id)}
                                                        className={`p-1.5 rounded-md transition-colors
                                                        ${publisher.booksCount > 0
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-900'}
                                                        `}
                                                        title="Xóa"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-gray-500 text-lg font-medium mb-1">Không tìm thấy nhà xuất bản nào</p>
                                                <p className="text-gray-400">Hãy thay đổi bộ lọc hoặc tạo nhà xuất bản mới</p>
                                            </div>
                                        </td>
                                    </tr>
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
                                            : 'text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-300 border-gray-300 bg-white'
                                            }`}
                                    >
                                        <span className="sr-only">Trước</span>
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${page === currentPage
                                                    ? 'z-10 bg-gradient-to-r from-green-500 to-teal-500 border-green-500 text-white shadow-sm'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-300'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-3 py-2 rounded-r-md border text-sm font-medium transform transition-all duration-200 ${currentPage === totalPages
                                            ? 'text-gray-300 cursor-not-allowed border-gray-200 bg-gray-50'
                                            : 'text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-300 border-gray-300 bg-white'
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
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-xl font-bold">Xác nhận xóa</h3>
                            </div>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg mt-4 mb-4">
                            <p className="text-red-800">
                                Bạn có chắc chắn muốn xóa nhà xuất bản này không?
                            </p>
                        </div>

                        <div className="mt-2">
                            <p className="text-gray-600">
                                Hành động này không thể hoàn tác. Nhà xuất bản sẽ bị xóa vĩnh viễn khỏi hệ thống.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all transform hover:-translate-y-0.5"
                            >
                                Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
