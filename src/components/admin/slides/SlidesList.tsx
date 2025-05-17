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
    EyeIcon,
} from '@heroicons/react/24/outline';
import { getSlides, toggleActive, ISlide, deleteSlide } from '@/api/axios/slides';

export default function SlidesList() {
    const [slides, setSlides] = useState<ISlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof ISlide>('title');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [togglingSlideId, setTogglingSlideId] = useState<number | null>(null);
    const [deletingSlideId, setDeletingSlideId] = useState<number | null>(null);
    const pageSize = 10;

    useEffect(() => {
        const fetchSlides = async () => {
            setIsLoading(true);
            try {
                const res = await getSlides({
                    page: currentPage,
                    size: pageSize,
                    search: searchQuery,
                    sortDirection: sortDirection,
                    sortField: sortField
                });
                setSlides(res.items);
                setTotalPages(res.totalPages);
                setTotalItems(res.totalItems);
            } catch (err) {
                console.error('Lỗi khi tải danh sách slides:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlides();
    }, [currentPage, searchQuery, sortField, sortDirection]);

    const handleSort = (field: keyof ISlide) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: keyof ISlide) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;
    };

    const handleToggleStatus = async (slideId: number, currentStatus: boolean) => {
        try {
            setTogglingSlideId(slideId);
            await toggleActive(slideId);
            const updatedSlides = slides.map(slide =>
                slide.id === slideId
                    ? { ...slide, isActive: !slide.isActive }
                    : slide
            );
            setSlides(updatedSlides);
            alert(`Đã ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'} slide thành công!`);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái slide:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái slide');
        } finally {
            setTogglingSlideId(null);
        }
    };

    const handleDelete = async (slideId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa slide này?')) {
            return;
        }

        try {
            setDeletingSlideId(slideId);
            await deleteSlide(slideId);
            setSlides(slides.filter(slide => slide.id !== slideId));
            alert('Xóa slide thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa slide:', error);
            alert('Có lỗi xảy ra khi xóa slide');
        } finally {
            setDeletingSlideId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header và actions */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl shadow-sm mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý Slides</h1>
                        </div>
                        <p className="text-sm text-gray-600">
                            Quản lý các slides hiển thị trên trang chủ của hệ thống
                        </p>
                    </div>
                    <Link
                        href="/admin/slides/add"
                        className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>Thêm slide mới</span>
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
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            placeholder="Tìm kiếm slide..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Danh sách slides */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                                        <span>ID</span>
                                        {getSortIcon('id')}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <span>Hình ảnh</span>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('title')}
                                >
                                    <div className="flex items-center">
                                        <span>Tiêu đề</span>
                                        {getSortIcon('title')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('description')}
                                >
                                    <div className="flex items-center">
                                        <span>Mô tả</span>
                                        {getSortIcon('description')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    <div className="flex items-center">
                                        <span>Trạng thái</span>
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
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-emerald-500"></div>
                                            <div>Đang tải...</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : slides.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                        {searchQuery ? 'Không tìm thấy slide nào phù hợp.' : 'Chưa có slide nào trong hệ thống.'}
                                    </td>
                                </tr>
                            ) : (
                                slides.map(slide => (
                                    <tr key={slide.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {slide.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-16 w-28 relative rounded overflow-hidden">
                                                <Image
                                                    src={slide.image}
                                                    alt={slide.alt || slide.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="112px"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {slide.title}
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                                            {slide.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${slide.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {slide.isActive ? 'Đang hoạt động' : 'Bị vô hiệu hóa'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={`/admin/slides/view/${slide.id}`} className="text-indigo-600 hover:text-indigo-900" title="Xem chi tiết">
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>
                                                <Link href={`/admin/slides/edit/${slide.id}`} className="text-blue-600 hover:text-blue-900" title="Chỉnh sửa">
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleStatus(slide.id, slide.isActive)}
                                                    className={`${slide.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                                                        } ${togglingSlideId === slide.id ? 'opacity-50 cursor-wait' : ''}`}
                                                    disabled={togglingSlideId === slide.id}
                                                    title={slide.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                                >
                                                    {togglingSlideId === slide.id ? (
                                                        <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full border-current"></div>
                                                    ) : (
                                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            {slide.isActive ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(slide.id)}
                                                    className={`text-red-600 hover:text-red-900 ${deletingSlideId === slide.id ? 'opacity-50 cursor-wait' : ''}`}
                                                    disabled={deletingSlideId === slide.id}
                                                    title="Xóa"
                                                >
                                                    {deletingSlideId === slide.id ? (
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
                                    Hiển thị <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> trong số <span className="font-medium">{totalItems}</span> slides
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
                                                        ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
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
