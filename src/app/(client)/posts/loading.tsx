"use client";

import React from "react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[50vh] w-full">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-3 text-gray-600 font-medium">Đang tải bài viết...</p>
            </div>
        </div>
    );
} 