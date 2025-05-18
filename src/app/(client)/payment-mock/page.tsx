'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentMockPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(10);

    // Get query parameters
    const amount = searchParams.get('amount') || '0';
    const method = searchParams.get('method') || 'unknown';

    useEffect(() => {
        // Auto-redirect after countdown
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/transaction_history');
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Successful!
                </h1>                <p className="text-gray-600 mb-6">
                    Your deposit of {formatCurrency(amount)} has been processed successfully.
                </p>

                <div className="p-4 bg-gray-50 rounded-md mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="text-gray-900 font-medium">
                            {Math.random().toString(36).substring(2, 10).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Amount:</span>
                        <span className="text-green-600 font-medium">
                            {formatCurrency(amount)}
                        </span>
                    </div>                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Payment method:</span>
                        <span className="text-gray-900 font-medium">
                            {method === 'bank_transfer' ? 'Bank Transfer' :
                                method === 'cash' ? 'Cash Payment' :
                                    method === 'wallet' ? 'E-Wallet' : method}
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Date:</span>
                        <span className="text-gray-900 font-medium">
                            {new Date().toLocaleString()}
                        </span>
                    </div>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    Redirecting to transaction history in {countdown} seconds...
                </p>

                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Link
                        href="/transaction_history"
                        className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        View History
                    </Link>
                    <Link
                        href="/deposit"
                        className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Make Another Deposit
                    </Link>
                </div>
            </div>
        </div>
    );
}
