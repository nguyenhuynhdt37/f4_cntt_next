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
import { getListAuthor, toggleActive, deleteAuthor } from '@/api/axios/authors';

type Author = {
    id: number;
    name: string;
    description: string;
    booksCount: number;
    createdAt: string;
    isActive: boolean;
};

export default function AuthorsList() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof Author>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [togglingAuthorId, setTogglingAuthorId] = useState<number | null>(null);
    const [deletingAuthorId, setDeletingAuthorId] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        const fetchAuthors = async () => {
            setIsLoading(true);
            try {
                const res = await getListAuthor({
                    page: currentPage,
                    size: pageSize,
                    search: searchQuery,
                    sortDirection: sortDirection,
                    sortField: sortField
                });
                setAuthors(res.items);
                setTotalPages(res.totalPages);
                setTotalItems(res.totalItems);
            } catch (err) {
                console.error('Lỗi khi tải danh sách tác giả:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuthors();
    }, [currentPage, searchQuery, sortField, sortDirection]);

    const handleSort = (field: keyof Author) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: keyof Author) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;
    };

    const handleToggleStatus = async (authorId: number, currentStatus: boolean) => {
        try {
            setTogglingAuthorId(authorId);

            // Gọi API để cập nhật trạng thái tác giả
            await toggleActive(authorId);

            // Tạo một bản sao của danh sách tác giả
            const updatedAuthors = authors.map(author =>
                author.id === authorId
                    ? { ...author, isActive: !author.isActive }
                    : author
            );

            // Cập nhật state với danh sách đã được cập nhật
            setAuthors(updatedAuthors);

            // Hiển thị thông báo thành công
            alert(`Đã ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'} tác giả thành công!`);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái tác giả:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái tác giả');
        } finally {
            // Xóa ID của tác giả đang được toggle
            setTogglingAuthorId(null);
        }
    };

    const confirmDelete = (authorId: number) => {
        setDeletingAuthorId(authorId);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        if (!deletingAuthorId) return;

        try {
            await deleteAuthor(deletingAuthorId);

            // Xóa tác giả khỏi danh sách
            const updatedAuthors = authors.filter(author => author.id !== deletingAuthorId);
            setAuthors(updatedAuthors);

            setShowDeleteConfirm(false);
            alert('Xóa tác giả thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa tác giả:', error);
            alert('Có lỗi xảy ra khi xóa tác giả');
        } finally {
            setDeletingAuthorId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header và actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý tác giả</h1>
                        </div>
                        <p className="text-gray-600 pl-10">Quản lý tất cả tác giả sách trong thư viện</p>
                    </div>
                    <Link
                        href="/admin/authors/add"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transform transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Thêm tác giả
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
                            placeholder="Tìm kiếm tác giả theo tên hoặc mô tả..."
                            value={searchQuery}
                            onChange={e => {
                                setCurrentPage(1); // reset về trang đầu khi tìm kiếm
                                setSearchQuery(e.target.value);
                            }}
                            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
                        <div className="bg-blue-100 text-blue-800 p-1.5 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span>Tổng số: <strong>{totalItems}</strong> tác giả</span>
                    </div>
                </div>
            </div>

            {/* Trạng thái loading */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[40vh] bg-white rounded-xl shadow-sm">
                    <div className="relative w-20 h-20">
                        <div className="w-20 h-20 rounded-full border-4 border-blue-200"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 text-gray-500 font-medium text-xl">Đang tải danh sách tác giả...</p>
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
                                            <span>Tên tác giả</span>
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-1">Mô tả</div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('booksCount')}>
                                        <div className="flex items-center gap-1">
                                            <span>Số tác phẩm</span>
                                            {getSortIcon('booksCount')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('isActive')}>
                                        <div className="flex items-center gap-1">
                                            <span>Trạng thái</span>
                                            {getSortIcon('isActive')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {authors.length > 0 ? (
                                    authors.map((author) => (
                                        <tr key={author.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {author.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{author.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-xs truncate">{author.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="text-indigo-600 p-1.5 rounded-full bg-indigo-100 mr-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm text-gray-900">{author.booksCount || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${author.isActive
                                                    ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border border-green-200'
                                                    : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border border-gray-200'
                                                    }`}>
                                                    <span className={`h-2 w-2 rounded-full mr-2 ${author.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                    {author.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={`/admin/authors/edit/${author.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md transition-colors"
                                                        title="Sửa"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </Link>

                                                    <button
                                                        onClick={() => handleToggleStatus(author.id, author.isActive)}
                                                        className={`px-3 py-1.5 rounded-md font-medium text-sm shadow-sm transition-all duration-200 flex items-center gap-1.5 ${togglingAuthorId === author.id
                                                                ? 'bg-gray-400 cursor-not-allowed text-white opacity-80'
                                                                : author.isActive
                                                                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                            }`}
                                                        title={author.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                                                        disabled={togglingAuthorId === author.id}
                                                    >
                                                        {togglingAuthorId === author.id ? (
                                                            <>
                                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                <span>Đang xử lý...</span>
                                                            </>
                                                        ) : author.isActive ? (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span>Tắt</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                <span>Bật</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    <button
                                                        disabled={author.booksCount > 0}
                                                        onClick={() => confirmDelete(author.id)}
                                                        className={`p-1.5 rounded-md transition-colors
                                                        ${author.booksCount > 0
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
                                                <p className="text-gray-500 text-lg font-medium mb-1">Không tìm thấy tác giả nào</p>
                                                <p className="text-gray-400">Hãy thay đổi bộ lọc hoặc tạo tác giả mới</p>
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
                                            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 border-gray-300 bg-white'
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
                                                    ? 'z-10 bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 text-white shadow-sm'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
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
                                            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 border-gray-300 bg-white'
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
                                Bạn có chắc chắn muốn xóa tác giả này không?
                            </p>
                        </div>

                        <div className="mt-2">
                            <p className="text-gray-600">
                                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến tác giả này sẽ bị xóa vĩnh viễn.
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
