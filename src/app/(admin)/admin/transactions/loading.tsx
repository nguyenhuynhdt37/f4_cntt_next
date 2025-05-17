"use client";

import React from "react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[50vh] w-full">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-3 text-gray-700 font-medium">Đang tải giao dịch...</p>
            </div>
        </div>
    );
} 