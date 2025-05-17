'use client';

import React from 'react';
import FavoriteDocumentList from '@/components/client/favorite_document/FavoriteDocumentList';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function FavoriteDocumentPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">                <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <FaArrowLeft className="mr-2" />
                <span>Quay lại</span>
            </Link>

                <div className="mb-8">
                    <div className="flex items-center justify-between pb-5">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <FaHeart className="h-8 w-8 text-red-500 mr-3" />
                                Tài liệu yêu thích
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">
                                Danh sách các tài liệu bạn đã đánh dấu yêu thích
                            </p>
                        </div>
                    </div>
                    <div className="border-b border-gray-200"></div>
                </div>

                <FavoriteDocumentList />
            </div>
        </div>
    );
}