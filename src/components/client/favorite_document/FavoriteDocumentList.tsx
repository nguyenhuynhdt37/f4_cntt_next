import React, { useState, useEffect } from 'react';
import { getFavoriteDocuments, removeFromFavorites } from '@/api/axios/document';
import Link from 'next/link';
import { FaHeart, FaDownload, FaEye, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Document {
    id: number | string;
    title: string;
    description: string;
    author: string;
    thumbnail: string;
    downloadCount: number;
    viewCount: number;
    createdAt: string;
    category: string;
}

const FavoriteDocumentList = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchFavoriteDocuments();
    }, [currentPage]);

    const fetchFavoriteDocuments = async () => {
        setLoading(true);
        try {
            const response = await getFavoriteDocuments({
                page: currentPage,
                size: itemsPerPage,
                search: searchTerm,
            });
            setDocuments(response.data);
            setTotalPages(Math.ceil(response.total / itemsPerPage));
        } catch (error) {
            console.error('Error fetching favorite documents:', error);
            toast.error('Không thể tải danh sách tài liệu yêu thích');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchFavoriteDocuments();
    };

    const handleRemoveFavorite = async (documentId: number | string) => {
        try {
            await removeFromFavorites(documentId);
            setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId));
            toast.success('Đã xóa khỏi danh sách yêu thích');
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast.error('Không thể xóa tài liệu khỏi mục yêu thích');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    if (loading && documents.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tài liệu yêu thích..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="absolute inset-y-0 right-0 flex items-center px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {documents.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="relative h-40 bg-gray-100">
                                    {doc.thumbnail ? (
                                        <img
                                            src={doc.thumbnail}
                                            alt={doc.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                                            <FaEye className="h-12 w-12 opacity-30" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleRemoveFavorite(doc.id)}
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white text-red-500 flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                                        title="Xóa khỏi danh sách yêu thích"
                                    >
                                        <FaTrash className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <Link
                                        href={`/documents/${doc.id}`}
                                        className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-1 mb-2"
                                    >
                                        {doc.title}
                                    </Link>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{doc.description}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>{doc.category}</span>
                                        <span>{formatDate(doc.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <FaEye className="mr-1" /> {doc.viewCount || 0}
                                        </div>
                                        <div className="flex items-center">
                                            <FaDownload className="mr-1" /> {doc.downloadCount || 0}
                                        </div>
                                        <div className="flex items-center text-red-500">
                                            <FaHeart className="mr-1" />
                                            <span>Đã thích</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${currentPage === 1
                                            ? 'cursor-not-allowed bg-gray-100'
                                            : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                        }`}
                                >
                                    <span className="sr-only">Trang trước</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i + 1
                                                ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${currentPage === totalPages
                                            ? 'cursor-not-allowed bg-gray-100'
                                            : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                        }`}
                                >
                                    <span className="sr-only">Trang sau</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                        <FaHeart className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-gray-900">Chưa có tài liệu yêu thích</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Bạn chưa thêm tài liệu nào vào danh sách yêu thích.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/documents"
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Khám phá tài liệu
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavoriteDocumentList;
