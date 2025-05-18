'use client';

import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <h2 className="text-lg font-medium text-gray-700 mb-1">Đang tải thông tin giao dịch</h2>
                        <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
