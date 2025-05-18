'use client';

import React from 'react';
import DepositForm from '@/components/client/deposit/DepositForm';

export default function TrangNapTien() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100 py-8 sm:py-12 px-2 sm:px-6 lg:px-12 xl:px-24">
            <div className="w-full">
                {/* Header section */}
                <div className="mb-8 sm:mb-10 bg-blue-600 p-6 rounded-lg shadow text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                        Nạp tiền vào tài khoản
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-blue-100">
                        Thêm tiền vào tài khoản của bạn để mua điểm và trải nghiệm các tính năng cao cấp.
                    </p>
                </div>

                {/* DepositForm section (form màu trắng) */}
                <DepositForm />
            </div>
        </div>
    );
}
