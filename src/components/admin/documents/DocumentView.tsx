'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    DocumentTextIcon,
    PencilSquareIcon,
    TrashIcon,
    DocumentArrowDownIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    XCircleIcon,
    SparklesIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { getDocumentById, deleteDocument, deleteComment } from '@/api/axios/document';

interface DocumentViewProps {
    id: string;
}

const DocumentView: React.FC<DocumentViewProps> = ({ id }) => {
    const router = useRouter();
    const [document, setDocument] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('preview');

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const data = await getDocumentById(id);
                setDocument(data);
            } catch (err: any) {
                setError(err.message || 'Không thể tải thông tin tài liệu');
                console.error('Error fetching document:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
            return;
        }

        try {
            await deleteDocument(id);
            router.push('/admin/documents');
        } catch (err) {
            console.error('Error deleting document:', err);
            alert('Có lỗi xảy ra khi xóa tài liệu');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'success':
                return (
                    <span className="flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Hoàn thành</span>
                    </span>
                );
            case 'working':
                return (
                    <span className="flex items-center gap-1 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        <span>Đang xử lý</span>
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1 text-sm text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                        <span>⏱️</span>
                        <span>Chờ xử lý</span>
                    </span>
                );
            case 'error':
                return (
                    <span className="flex items-center gap-1 text-sm text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                        <XCircleIcon className="h-4 w-4" />
                        <span>Thất bại</span>
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                        <span>Không xác định</span>
                    </span>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-sm text-gray-600">Đang tải thông tin tài liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex text-sm flex-col items-center justify-center min-h-screen bg-gray-50 py-12">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                        <XCircleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center">
                        <h3 className="text-sm font-medium text-gray-900">Lỗi</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">{error}</p>
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => router.push('/admin/documents')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Quay lại danh sách
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header và actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-sm">
                                <DocumentTextIcon className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-800">Chi tiết tài liệu</h1>
                        </div>
                        <p className="text-sm text-gray-600 pl-10 truncate">{document?.title}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/admin/documents"
                            className="flex items-center gap-2 px-4 py-2 bg-white text-sm text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            <span>Quay lại</span>
                        </Link>
                        <Link
                            href={`/admin/documents/edit/${id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-sm text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                            <span>Chỉnh sửa</span>
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-sm text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                        >
                            <TrashIcon className="h-5 w-5" />
                            <span>Xóa</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
                {/* Thông tin tài liệu */}
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
                    <h2 className="font-semibold text-sm text-gray-800 mb-4">Thông tin tài liệu</h2>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                            {getStatusBadge(document?.summarystatus)}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Phê duyệt</p>
                                {document?.status === 0 || document?.status === undefined ? (
                                    <span className="flex items-center gap-1 text-sm text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                                        <span className="h-4 w-4">⏱️</span>
                                        <span>Chờ xử lý</span>
                                    </span>
                                ) : document?.status === 1 ? (
                                    <span className="flex items-center gap-1 text-sm text-green-700 bg-green-50 px-2 py-1 rounded">
                                        <CheckCircleIcon className="h-4 w-4" />
                                        <span>Đã phê duyệt</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-sm text-red-700 bg-red-50 px-2 py-1 rounded">
                                        <XCircleIcon className="h-4 w-4" />
                                        <span>Từ chối</span>
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Loại tài liệu</p>
                                {document?.isPremium ? (
                                    <span className="flex items-center gap-1 text-sm text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                        <SparklesIcon className="h-4 w-4" />
                                        <span>Premium</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded">
                                        <span>📄</span>
                                        <span>Free</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tên tài liệu</p>
                            <p className="text-sm font-medium text-gray-900">{document?.title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Số trang</p>
                                <p className="text-sm font-medium text-gray-900">{document?.totalPages || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Giới hạn xem</p>
                                <p className="text-sm font-medium text-gray-900">{document?.previewPageLimit || 'N/A'} trang</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tác giả</p>
                            <p className="text-sm font-medium text-gray-900">{document?.author}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Nhà xuất bản</p>
                            <p className="text-sm font-medium text-gray-900">{document?.publisher}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Danh mục</p>
                            <div className="mt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {document?.category}
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Ngày tạo</p>
                            <p className="text-sm font-medium text-gray-900">{document?.createdAt ? formatDate(document.createdAt) : 'N/A'}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Ngày cập nhật</p>
                            <p className="text-sm font-medium text-gray-900">{document?.updatedAt ? formatDate(document.updatedAt) : 'N/A'}</p>
                        </div>

                        {document?.fileUrl && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <a
                                    href={document.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <DocumentArrowDownIcon className="h-5 w-5" />
                                    <span>Tải xuống tài liệu gốc</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nội dung tài liệu */}
                <div className="bg-white rounded-xl shadow-sm lg:col-span-2 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`py-4 px-6 text-sm font-medium ${activeTab === 'preview'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Xem trước
                            </button>
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`py-4 px-6 text-sm font-medium ${activeTab === 'description'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Mô tả
                            </button>
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`py-4 px-6 text-sm font-medium ${activeTab === 'comments'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Bình luận
                            </button>
                        </nav>
                    </div>
                    <div className="p-6">
                        {activeTab === 'preview' && (
                            <>
                                {document?.conversionStatus === 'completed' && document?.previewUrl ? (
                                    <div className="aspect-[3/4] w-full">
                                        <iframe
                                            src={document.previewUrl}
                                            className="w-full h-full border-0 rounded"
                                            title={`Xem trước: ${document.title}`}
                                            allow="fullscreen"
                                        ></iframe>
                                    </div>
                                ) : document?.conversionStatus === 'processing' ? (
                                    <div className="flex flex-col items-center justify-center h-96">
                                        <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin" />
                                        <p className="mt-4 text-sm font-medium text-gray-700">Đang xử lý tài liệu</p>
                                        <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát...</p>
                                    </div>
                                ) : document?.conversionStatus === 'failed' ? (
                                    <div className="flex flex-col items-center justify-center h-96">
                                        <XCircleIcon className="h-12 w-12 text-red-500" />
                                        <p className="mt-4 text-sm font-medium text-gray-700">Xử lý tài liệu thất bại</p>
                                        <p className="text-sm text-gray-500">Vui lòng thử tải lại tài liệu.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-96">
                                        <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                                        <p className="mt-4 text-sm font-medium text-gray-700">Xem trước không khả dụng</p>
                                        <p className="text-sm text-gray-500">Tài liệu đang chờ xử lý hoặc chưa được chuyển đổi.</p>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'description' && (
                            <div className="prose max-w-none">
                                <p className="text-sm whitespace-pre-wrap">{document?.description || 'Không có mô tả cho tài liệu này.'}</p>
                            </div>
                        )}

                        {activeTab === 'comments' && (
                            <div className="space-y-4">
                                {document?.comments?.length > 0 ? (
                                    document.comments.map((comment: any, index: number) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden">
                                                        {comment.userName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{comment.userName || 'Người dùng ẩn danh'}</p>
                                                        <p className="text-sm text-gray-500">{comment.createdAt ? formatDate(comment.createdAt) : ''}</p>
                                                        <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="text-gray-400 hover:text-red-500"
                                                    onClick={() => {
                                                        if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
                                                            // Call the API to delete the comment
                                                            deleteComment(id, comment.id)
                                                                .then(() => {
                                                                    // Reload the document to refresh comments
                                                                    getDocumentById(id).then(data => setDocument(data));
                                                                    alert('Đã xóa bình luận thành công');
                                                                })
                                                                .catch((err: any) => {
                                                                    console.error('Lỗi khi xóa bình luận:', err);
                                                                    alert('Có lỗi xảy ra khi xóa bình luận');
                                                                });
                                                        }
                                                    }}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300" />
                                        <p className="mt-2 text-sm text-gray-500">Chưa có bình luận nào</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentView;
