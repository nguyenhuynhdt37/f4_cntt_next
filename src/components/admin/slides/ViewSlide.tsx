'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import { getSlideById, deleteSlide, ISlide } from '@/api/axios/slides';

interface ViewSlideProps {
    slideId: number;
}

export default function ViewSlide({ slideId }: ViewSlideProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [slide, setSlide] = useState<ISlide | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSlideDetails = async () => {
            try {
                setIsLoading(true);
                const data = await getSlideById(slideId);
                setSlide(data);
            } catch (err) {
                console.error('Lỗi khi tải thông tin slide:', err);
                setError('Không thể tải thông tin slide. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };

        if (slideId) {
            fetchSlideDetails();
        }
    }, [slideId]);

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa slide này?')) {
            return;
        }

        try {
            setIsDeleting(true);
            await deleteSlide(slideId);

            // Show success message
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
                            Xóa slide thành công!
                        </p>
                    </div>
                </div>
            `;
            document.body.appendChild(successMessage);

            setTimeout(() => {
                document.body.removeChild(successMessage);
                router.push('/admin/slides');
            }, 2000);
        } catch (err) {
            console.error('Lỗi khi xóa slide:', err);
            setError('Không thể xóa slide. Vui lòng thử lại sau.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                <span className="ml-2 text-gray-500">Đang tải thông tin slide...</span>
            </div>
        );
    }

    if (error || !slide) {
        return (
            <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-red-800 font-medium">Đã xảy ra lỗi</h3>
                <p className="text-red-700">{error || 'Không tìm thấy thông tin slide'}</p>
                <Link href="/admin/slides" className="mt-4 inline-block text-blue-600 hover:underline">
                    Quay lại danh sách slides
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <Link href="/admin/slides" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Chi tiết slide</h1>
                </div>
                <div className="flex space-x-3">
                    <Link
                        href={`/admin/slides/edit/${slideId}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        <PencilSquareIcon className="-ml-1 mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
                    >
                        {isDeleting ? (
                            <>
                                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-t-transparent rounded-full border-white"></div>
                                Đang xóa...
                            </>
                        ) : (
                            <>
                                <TrashIcon className="-ml-1 mr-2 h-4 w-4" />
                                Xóa
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Main image */}
                <div className="relative h-80 sm:h-96 w-full">
                    <Image
                        src={slide.image}
                        alt={slide.alt || slide.title}
                        fill
                        className="object-cover"
                    />
                    {slide.overlayImage && (
                        <div className="absolute inset-0">
                            <Image
                                src={slide.overlayImage}
                                alt="Overlay"
                                fill
                                className="object-cover opacity-50"
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">{slide.title}</h2>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${slide.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            {slide.isActive ? 'Đang hoạt động' : 'Bị vô hiệu hóa'}
                        </span>
                    </div>

                    <div className="prose max-w-none">
                        <p>{slide.description}</p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">ID</dt>
                                <dd className="mt-1 text-sm text-gray-900">{slide.id}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Alt text</dt>
                                <dd className="mt-1 text-sm text-gray-900">{slide.alt || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {slide.createdAt
                                        ? new Date(slide.createdAt).toLocaleString('vi-VN')
                                        : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Lần cập nhật gần nhất</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {slide.updatedAt
                                        ? new Date(slide.updatedAt).toLocaleString('vi-VN')
                                        : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Hình ảnh chính</dt>
                                <dd className="mt-1 text-sm text-gray-900 break-all">
                                    <a href={slide.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                        Xem hình ảnh gốc
                                    </a>
                                </dd>
                            </div>
                            {slide.overlayImage && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Hình ảnh overlay</dt>
                                    <dd className="mt-1 text-sm text-gray-900 break-all">
                                        <a href={slide.overlayImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                            <EyeIcon className="h-4 w-4 mr-1" />
                                            Xem hình ảnh overlay gốc
                                        </a>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-between">
                <Link
                    href="/admin/slides"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    <ArrowLeftIcon className="-ml-1 mr-2 h-4 w-4" />
                    Quay lại danh sách
                </Link>

                <div className="flex space-x-2">
                    <Link
                        href={`/admin/slides/edit/${slideId}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        <PencilSquareIcon className="-ml-1 mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </Link>
                </div>
            </div>
        </div>
    );
}
