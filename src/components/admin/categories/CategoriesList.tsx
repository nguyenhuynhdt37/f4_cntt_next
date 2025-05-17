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
import { deleteCategory, getListCategory, togleActive } from '@/api/axios/categories';

type Category = {
    id: number;
    name: string;
    description: string;
    booksCount: number;
    createdAt: string;
    isActive: boolean;
};

export default function CategoriesList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof Category>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [togglingCategoryId, setTogglingCategoryId] = useState<number | null>(null);
    const pageSize = 10;
    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await getListCategory({
                page: currentPage,
                size: pageSize,
                search: searchQuery,
                sortDirection: sortDirection,
                sortField: sortField
            });
            setCategories(res.items);
            setTotalPages(res.totalPages);
            setTotalItems(res.totalItems);
        } catch (err) {
            console.error('Lỗi khi tải danh mục:', err);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, [currentPage, searchQuery, sortField, sortDirection]);

    const handleSort = (field: keyof Category) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: keyof Category) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;
    };

    const handleToggleStatus = async (categoryId: number, currentStatus: boolean) => {
        try {
            setTogglingCategoryId(categoryId);
            await togleActive(categoryId);
            const updatedCategories = categories.map(category =>
                category.id === categoryId
                    ? { ...category, isActive: !category.isActive }
                    : category
            );
            setCategories(updatedCategories);
            alert(`Đã ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'} danh mục thành công!`);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái danh mục:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái danh mục');
        } finally {
            setTogglingCategoryId(null);
        }
    };
    const handleDeleteCategory = async (categoryId: number) => {
        try {
            await deleteCategory(categoryId);
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed top-4 right-4 bg-white border-l-4 border-green-500 shadow-lg rounded-lg px-6 py-4 z-50 animate-fadeIn';
            successMessage.innerHTML = `
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-green-800">
                            Xóa danh mục thành công!
                        </p>
                    </div>
                </div>
            `;
            document.body.appendChild(successMessage);
            await fetchCategories();
            document.body.removeChild(successMessage);
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
            alert('Có lỗi xảy ra khi xóa danh mục');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header và actions */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl shadow-sm mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
                        </div>
                        <p className="text-gray-600 pl-10">Quản lý tất cả danh mục sách trong thư viện</p>
                    </div>
                    <Link
                        href="/admin/categories/add"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-emerald-600 hover:to-green-700 transform transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Thêm danh mục
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
                            placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
                            value={searchQuery}
                            onChange={e => {
                                setCurrentPage(1); // reset về trang đầu khi tìm kiếm
                                setSearchQuery(e.target.value);
                            }}
                            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
                        <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span>Tổng số: <strong>{totalItems}</strong> danh mục</span>
                    </div>
                </div>
            </div>

            {/* Trạng thái loading */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[40vh] bg-white rounded-xl shadow-sm">
                    <div className="relative w-20 h-20">
                        <div className="w-20 h-20 rounded-full border-4 border-emerald-200"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 text-gray-500 font-medium text-xl">Đang tải danh mục...</p>
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
                                            <span>Tên danh mục</span>
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-1">Mô tả</div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('booksCount')}>
                                        <div className="flex items-center gap-1">
                                            <span>Số tài liệu</span>
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
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {category.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-xs truncate">{category.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="text-indigo-600 p-1.5 rounded-full bg-indigo-100 mr-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm text-gray-900">{category.booksCount}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${category.isActive
                                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                                                    : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border border-gray-200'
                                                    }`}>
                                                    <span className={`h-2 w-2 rounded-full mr-2 ${category.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                    {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={`/admin/categories/edit/${category.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md transition-colors"
                                                        title="Sửa"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </Link>

                                                    <button
                                                        onClick={() => handleToggleStatus(category.id, category.isActive)}
                                                        className={`px-3 py-1.5 rounded-md font-medium text-sm shadow-sm transition-all duration-200 flex items-center gap-1.5 ${togglingCategoryId === category.id
                                                            ? 'bg-gray-400 cursor-not-allowed text-white opacity-80'
                                                            : category.isActive
                                                                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                                                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                                            }`}
                                                        title={category.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                                                        disabled={togglingCategoryId === category.id}
                                                    >
                                                        {togglingCategoryId === category.id ? (
                                                            <>
                                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                <span>Đang xử lý...</span>
                                                            </>
                                                        ) : category.isActive ? (
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
                                                        disabled={category.booksCount > 0}
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        className={`p-1.5 rounded-md transition-colors
                                                        ${category.booksCount > 0
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
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-gray-500 text-lg font-medium mb-1">Không tìm thấy danh mục nào</p>
                                                <p className="text-gray-400">Hãy thay đổi bộ lọc hoặc tạo danh mục mới</p>
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
                                            : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 border-gray-300 bg-white'
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
                                                    ? 'z-10 bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-500 text-white shadow-sm'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300'
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
                                            : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 border-gray-300 bg-white'
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
        </div>
    );
}
