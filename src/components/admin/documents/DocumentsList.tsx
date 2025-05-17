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
    DocumentTextIcon,
    EyeIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XCircleIcon,
    SparklesIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import { getDocuments, toggleDocumentApproval, toggleDocumentPremium, deleteDocument } from '@/api/axios/document';

type Document = {
    id: number;
    title: string;
    description: string;
    author: string;
    publisher: string;
    category: string;
    createdAt: string;
    isApproved: boolean;
    isPremium: boolean;
    totalPages: number;
    conversionStatus?: string;
    previewUrl?: string;
    fileUrl?: string;
};

type SortField = 'title' | 'author' | 'category' | 'createdAt' | 'isApproved' | 'isPremium';

export default function DocumentsList() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [approvalFilter, setApprovalFilter] = useState<string>('all');
    const pageSize = 10;

    useEffect(() => {
        fetchDocuments();
    }, [currentPage, searchQuery, sortField, sortDirection, approvalFilter]);

    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            // Xây dựng params cho API call
            const params: any = {
                page: currentPage,
                size: pageSize,
                search: searchQuery,
                sortDirection: sortDirection,
                sortField: sortField
            };
            
            // Thêm tham số lọc theo trạng thái phê duyệt
            if (approvalFilter !== 'all') {
                if (approvalFilter === 'pending') {
                    params.isApproved = null;
                } else if (approvalFilter === 'approved') {
                    params.isApproved = 1;
                } else if (approvalFilter === 'rejected') {
                    params.isApproved = 0;
                }
            }
            
            const res = await getDocuments(params);

            setDocuments(res.items);
            setTotalPages(res.totalPages);
            setTotalItems(res.totalItems);
        } catch (err) {
            console.error('Lỗi khi tải danh sách tài liệu:', err);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleToggleApproval = async (id: number) => {
        if (processingId) return;

        setProcessingId(id);
        try {
            await toggleDocumentApproval(id);
            setDocuments(documents.map(doc =>
                doc.id === id ? { ...doc, isApproved: !doc.isApproved } : doc
            ));
        } catch (error) {
            console.error('Lỗi khi thay đổi trạng thái phê duyệt:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái phê duyệt');
        } finally {
            setProcessingId(null);
        }
    };

    const handleTogglePremium = async (id: number) => {
        if (processingId) return;

        setProcessingId(id);
        try {
            await toggleDocumentPremium(id);
            setDocuments(documents.map(doc =>
                doc.id === id ? { ...doc, isPremium: !doc.isPremium } : doc
            ));
        } catch (error) {
            console.error('Lỗi khi thay đổi trạng thái premium:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái premium');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeleteDocument = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
            try {
                await deleteDocument(id);
                setDocuments(documents.filter(doc => doc.id !== id));
                alert('Xóa tài liệu thành công!');
            } catch (error) {
                console.error('Lỗi khi xóa tài liệu:', error);
                alert('Có lỗi xảy ra khi xóa tài liệu');
            }
        }
    };

    const getStatusBadge = (status?: string) => {
        if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';

        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status?: string) => {
        if (!status) return null;

        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircleIcon className="h-4 w-4 mr-1" />;
            case 'pending':
                return <ClockIcon className="h-4 w-4 mr-1" />;
            case 'processing':
                return <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />;
            case 'failed':
                return <XCircleIcon className="h-4 w-4 mr-1" />;
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
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-sm">
                                <DocumentTextIcon className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý tài liệu</h1>
                        </div>
                        <p className="text-gray-600 pl-10">Quản lý tài liệu trong thư viện số</p>
                    </div>
                    <Link
                        href="/admin/documents/add"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transform transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Thêm tài liệu
                    </Link>
                </div>
            </div>

            {/* Filter và search */}
            <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                        <div className="relative w-full sm:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm tài liệu theo tiêu đề, tác giả..."
                                value={searchQuery}
                                onChange={e => {
                                    setCurrentPage(1); // reset về trang đầu khi tìm kiếm
                                    setSearchQuery(e.target.value);
                                }}
                                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        
                        <div className="w-full sm:w-auto">
                            <select 
                                value={approvalFilter}
                                onChange={(e) => {
                                    setApprovalFilter(e.target.value);
                                    setCurrentPage(1); // reset về trang đầu khi thay đổi filter
                                }}
                                className="w-full py-3 px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="pending">Chờ xử lý</option>
                                <option value="approved">Đã phê duyệt</option>
                                <option value="rejected">Từ chối</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
                        <div className="bg-blue-100 text-blue-800 p-1.5 rounded-full mr-2">
                            <DocumentTextIcon className="h-5 w-5" />
                        </div>
                        <span>Tổng số: <strong>{totalItems}</strong> tài liệu</span>
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
                    <p className="mt-6 text-gray-500 font-medium text-xl">Đang tải tài liệu...</p>
                    <p className="text-gray-400 italic mt-2">Vui lòng đợi trong giây lát</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('title')}>
                                        <div className="flex items-center gap-1">
                                            <span>Tiêu đề</span>
                                            {getSortIcon('title')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('author')}>
                                        <div className="flex items-center gap-1">
                                            <span>Tác giả</span>
                                            {getSortIcon('author')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('category')}>
                                        <div className="flex items-center gap-1">
                                            <span>Danh mục</span>
                                            {getSortIcon('category')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-1">
                                            <span>Trạng thái</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('isApproved')}>
                                        <div className="flex items-center gap-1">
                                            <span>Phê duyệt</span>
                                            {getSortIcon('isApproved')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('isPremium')}>
                                        <div className="flex items-center gap-1">
                                            <span>Premium</span>
                                            {getSortIcon('isPremium')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {documents.length > 0 ? (
                                    documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                                                        <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{doc.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{doc.author}</div>
                                                <div className="text-xs text-gray-500">{doc.publisher}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                                    {doc.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusBadge(doc.conversionStatus)}`}>
                                                    {doc.conversionStatus === 'processing' && (
                                                        <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                                                    )}
                                                    {doc.conversionStatus === 'completed' && (
                                                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                    )}
                                                    {doc.conversionStatus === 'pending' && (
                                                        <span className="h-3 w-3 mr-1">⏱️</span>
                                                    )}
                                                    {doc.conversionStatus === 'failed' && (
                                                        <XCircleIcon className="h-3 w-3 mr-1" />
                                                    )}
                                                    {doc.conversionStatus ?
                                                        doc.conversionStatus.charAt(0).toUpperCase() + doc.conversionStatus.slice(1) :
                                                        'Hoàn thành'}
                                                </span>
                                                {doc.totalPages > 0 && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {doc.totalPages} trang
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleApproval(doc.id)}
                                                    disabled={processingId === doc.id}
                                                    className={`flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                                    ${processingId === doc.id
                                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                            : doc.isApproved
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {processingId === doc.id ? (
                                                        <>
                                                            <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                                                            Đang xử lý...
                                                        </>
                                                    ) : doc.isApproved ? (
                                                        <>
                                                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                            Đã phê duyệt
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircleIcon className="h-3 w-3 mr-1" />
                                                            Chưa duyệt
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleTogglePremium(doc.id)}
                                                    disabled={processingId === doc.id}
                                                    className={`flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                                    ${processingId === doc.id
                                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                            : doc.isPremium
                                                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {processingId === doc.id ? (
                                                        <>
                                                            <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                                                            Đang xử lý...
                                                        </>
                                                    ) : doc.isPremium ? (
                                                        <>
                                                            <SparklesIcon className="h-3 w-3 mr-1" />
                                                            Premium
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="h-3 w-3 mr-1">📄</span>
                                                            Free
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/documents/view/${doc.id}`}
                                                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-md transition-colors"
                                                        title="Xem tài liệu"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/documents/edit/${doc.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md transition-colors"
                                                        title="Sửa"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteDocument(doc.id)}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
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
                                                <DocumentTextIcon className="h-12 w-12 text-gray-300 mb-2" />
                                                <p className="text-gray-500 text-lg font-medium mb-1">Không tìm thấy tài liệu nào</p>
                                                <p className="text-gray-400">Hãy thay đổi bộ lọc hoặc tạo tài liệu mới</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
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
        </div>
    );
}
