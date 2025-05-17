'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeftIcon,
    BookOpenIcon,
    UserIcon,
    BuildingLibraryIcon,
    CalendarIcon,
    IdentificationIcon,
    BookmarkIcon,
    ChartBarIcon,
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

interface BookDetail {
    id: number;
    title: string;
    description: string;
    author: string;
    publisher: string;
    category: string;
    publishDate: string;
    isbn: string;
    quantity: number;
    availableQuantity: number;
    coverImage: string;
    borrowCount: number;
    location: string;
    pageCount: number;
    language: string;
    status: 'available' | 'limited' | 'unavailable';
}

// This would be fetched from the API in a real implementation
const mockBookDetail: BookDetail = {
    id: 1,
    title: 'Lập trình với Python',
    description: 'Cuốn sách giới thiệu về ngôn ngữ lập trình Python từ cơ bản đến nâng cao, với nhiều ví dụ thực tế và bài tập thực hành. Phù hợp cho người mới bắt đầu học lập trình.',
    author: 'Nguyễn Văn A',
    publisher: 'NXB Giáo dục',
    category: 'Công nghệ thông tin',
    publishDate: '2023-05-15',
    isbn: '9781234567897',
    quantity: 5,
    availableQuantity: 3,
    coverImage: '/images/book-covers/python-programming.jpg',
    borrowCount: 12,
    location: 'Kệ A2-15',
    pageCount: 450,
    language: 'Tiếng Việt',
    status: 'available'
};

interface BookDetailsProps {
    id?: number;
}

const BookDetails: React.FC<BookDetailsProps> = ({ id }) => {
    const router = useRouter();
    const [book, setBook] = useState<BookDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // In a real implementation, this would be an API call
        const fetchBookDetails = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                setBook(mockBookDetail);
                setIsLoading(false);
            } catch (err) {
                setError('Đã xảy ra lỗi khi tải thông tin sách');
                setIsLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'available':
                return (
                    <span className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Còn sách
                    </span>
                );
            case 'limited':
                return (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                        <ChartBarIcon className="h-3 w-3 mr-1" />
                        Số lượng hạn chế
                    </span>
                );
            case 'unavailable':
                return (
                    <span className="bg-red-100 text-red-800 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                        <XCircleIcon className="h-3 w-3 mr-1" />
                        Hết sách
                    </span>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex space-x-4">
                        <div className="h-40 w-32 bg-gray-200 rounded"></div>
                        <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center py-6">
                    <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Không thể tải thông tin sách</h3>
                    <p className="mt-1 text-gray-500">{error || 'Đã xảy ra lỗi, vui lòng thử lại sau'}</p>
                    <div className="mt-6">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => router.back()}
                            className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={`/admin/library/books/edit/${book.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <PencilSquareIcon className="h-4 w-4 mr-1" />
                            Chỉnh sửa
                        </Link>
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Xoá
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mt-6">
                    {/* Book cover */}
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden relative">
                            {book.coverImage ? (
                                <Image
                                    src={book.coverImage}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <BookOpenIcon className="h-16 w-16 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex justify-center">
                            {getStatusBadge(book.status)}
                        </div>
                    </div>

                    {/* Book details */}
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin sách</h3>
                                    <dl className="space-y-3">
                                        <div className="flex items-start">
                                            <dt className="flex items-center text-sm font-medium text-gray-500 w-1/3">
                                                <UserIcon className="h-4 w-4 mr-2" />
                                                Tác giả
                                            </dt>
                                            <dd className="text-sm text-gray-900">{book.author}</dd>
                                        </div>
                                        <div className="flex items-start">
                                            <dt className="flex items-center text-sm font-medium text-gray-500 w-1/3">
                                                <BuildingLibraryIcon className="h-4 w-4 mr-2" />
                                                Nhà xuất bản
                                            </dt>
                                            <dd className="text-sm text-gray-900">{book.publisher}</dd>
                                        </div>
                                        <div className="flex items-start">
                                            <dt className="flex items-center text-sm font-medium text-gray-500 w-1/3">
                                                <BookmarkIcon className="h-4 w-4 mr-2" />
                                                Danh mục
                                            </dt>
                                            <dd className="text-sm text-gray-900">{book.category}</dd>
                                        </div>
                                        <div className="flex items-start">
                                            <dt className="flex items-center text-sm font-medium text-gray-500 w-1/3">
                                                <CalendarIcon className="h-4 w-4 mr-2" />
                                                Ngày xuất bản
                                            </dt>
                                            <dd className="text-sm text-gray-900">{new Date(book.publishDate).toLocaleDateString('vi-VN')}</dd>
                                        </div>
                                        <div className="flex items-start">
                                            <dt className="flex items-center text-sm font-medium text-gray-500 w-1/3">
                                                <IdentificationIcon className="h-4 w-4 mr-2" />
                                                ISBN
                                            </dt>
                                            <dd className="text-sm text-gray-900">{book.isbn}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                                    <dl className="space-y-3">
                                        <div className="flex items-start">
                                            <dt className="text-sm font-medium text-gray-500 w-1/3">Số trang</dt>
                                            <dd className="text-sm text-gray-900">{book.pageCount}</dd>
                                        </div>
                                        <div className="flex items-start">
                                            <dt className="text-sm font-medium text-gray-500 w-1/3">Ngôn ngữ</dt>
                                            <dd className="text-sm text-gray-900">{book.language}</dd>
                                        </div>
                                        <div className="flex items-start">
                                            <dt className="text-sm font-medium text-gray-500 w-1/3">Vị trí</dt>
                                            <dd className="text-sm text-gray-900">{book.location}</dd>
                                        </div>
                                        <div className="flex items-start">
                                            <dt className="text-sm font-medium text-gray-500 w-1/3">Tổng số bản sao</dt>
                                            <dd className="text-sm text-gray-900">{book.quantity}</dd>
                                        </div>
                                        <div className="flex items-start">
                                            <dt className="text-sm font-medium text-gray-500 w-1/3">Số lượng khả dụng</dt>
                                            <dd className="text-sm text-gray-900">{book.availableQuantity}</dd>
                                        </div>
                                        <div className="flex items-start">
                                            <dt className="text-sm font-medium text-gray-500 w-1/3">Số lần mượn</dt>
                                            <dd className="text-sm text-gray-900">{book.borrowCount}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả</h3>
                            <div className="prose prose-sm max-w-none text-gray-700">
                                <p>{book.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
