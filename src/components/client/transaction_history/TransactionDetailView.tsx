'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    CreditCardIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { getUserTransactionById } from '@/api/axios/transactions';
import { formatCurrency, formatDateTime } from '@/utils/formatter';

type Transaction = {
    id: number;
    packageId?: number;
    packageName?: string;
    amount: number;
    paymentMethod?: string;
    transactionCode: string;
    status: string;
    createdAt: string;
    responseData?: string;
    type: string;
    points?: number;
};

export default function TransactionDetailView({ id }: { id: string }) {
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch transaction data
    useEffect(() => {
        const fetchTransactionDetails = async () => {
            try {
                setIsLoading(true);
                const data = await getUserTransactionById(id);
                setTransaction(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching transaction details:', err);
                setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu giao dịch.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactionDetails();
    }, [id]);

    // Get status color based on transaction status
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    // Get status icon based on transaction status
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'pending':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'failed':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case 'cancelled':
                return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
            default:
                return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
        }
    };

    // Get payment method details
    const getPaymentMethod = (method: string = 'unknown') => {
        switch (method.toLowerCase()) {
            case 'vnpay':
                return {
                    name: 'VNPay',
                    icon: '/images/payment/vnpay.png',
                    fallbackIcon: (
                        <div className="h-5 w-5 rounded bg-blue-100 flex items-center justify-center text-blue-600 mr-2">VN</div>
                    ),
                    bgColor: 'bg-blue-50',
                };
            case 'momo':
                return {
                    name: 'Momo',
                    icon: '/images/payment/momo.png',
                    fallbackIcon: (
                        <div className="h-5 w-5 rounded bg-pink-100 flex items-center justify-center text-pink-600 mr-2">MO</div>
                    ),
                    bgColor: 'bg-pink-50',
                };
            case 'zalopay':
                return {
                    name: 'ZaloPay',
                    icon: '/images/payment/zalopay.png',
                    fallbackIcon: (
                        <div className="h-5 w-5 rounded bg-blue-100 flex items-center justify-center text-blue-600 mr-2">ZL</div>
                    ),
                    bgColor: 'bg-blue-50',
                };
            case 'bank_transfer':
                return {
                    name: 'Chuyển khoản ngân hàng',
                    icon: '/images/payment/bank.png',
                    fallbackIcon: (
                        <div className="h-5 w-5 rounded bg-green-100 flex items-center justify-center text-green-600 mr-2">BK</div>
                    ),
                    bgColor: 'bg-green-50',
                };
            default:
                return {
                    name: method,
                    icon: null,
                    fallbackIcon: (
                        <div className="h-5 w-5 rounded bg-gray-100 flex items-center justify-center text-gray-600 mr-2">
                            {method.substring(0, 2).toUpperCase()}
                        </div>
                    ),
                    bgColor: 'bg-gray-50',
                };
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm text-gray-600">Đang tải thông tin giao dịch...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                        <XCircleIcon className="h-6 w-6 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Không thể tải thông tin giao dịch</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        href="/transaction_history"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Quay lại lịch sử giao dịch
                    </Link>
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
                        <InformationCircleIcon className="h-6 w-6 text-yellow-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy giao dịch</h2>
                    <p className="text-gray-600 mb-6">Giao dịch với ID {id} không tồn tại hoặc đã bị xóa.</p>
                    <Link
                        href="/transaction_history"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Quay lại lịch sử giao dịch
                    </Link>
                </div>
            </div>
        );
    }

    const paymentMethod = transaction.paymentMethod ? getPaymentMethod(transaction.paymentMethod) : null;
    const statusColor = getStatusColor(transaction.status);
    const statusIcon = getStatusIcon(transaction.status);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-2xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 py-4 px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="mr-3 bg-white/20 rounded-lg p-2">
                            <CreditCardIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Chi tiết giao dịch #{transaction.id}</h1>
                        </div>
                    </div>
                    <Link
                        href="/transaction_history"
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-all text-sm"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        <span>Quay lại</span>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Transaction Info */}
                <div className="space-y-5">
                    {/* Status */}
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">Trạng thái</span>
                        <div className="flex items-center">
                            {statusIcon}
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                {transaction.status === 'completed' ? 'Thành công' :
                                    transaction.status === 'pending' ? 'Đang xử lý' :
                                        transaction.status === 'failed' ? 'Thất bại' :
                                            transaction.status === 'cancelled' ? 'Đã hủy' : transaction.status}
                            </span>
                        </div>
                    </div>

                    {/* Type */}
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">Loại giao dịch</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.type.toLowerCase() === 'deposit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                            {transaction.type.toLowerCase() === 'deposit' ? 'Nạp tiền' : 'Đổi điểm'}
                        </span>
                    </div>

                    {/* Amount */}
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">Số tiền</span>
                        <div className="text-base font-semibold text-gray-900">{formatCurrency(transaction.amount)}</div>
                    </div>

                    {/* Transaction Code */}
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">Mã giao dịch</span>
                        <div className="text-sm font-medium text-gray-900">{transaction.transactionCode}</div>
                    </div>

                    {/* Payment method - if available */}
                    {paymentMethod && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600 font-medium">Phương thức thanh toán</span>
                            <div className={`flex items-center ${paymentMethod.bgColor} px-2 py-1 rounded-lg text-sm`}>
                                {paymentMethod.icon ? (
                                    <img
                                        src={paymentMethod.icon}
                                        alt={paymentMethod.name}
                                        className="h-4 w-4 mr-2"
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            target.style.display = 'none';

                                            // Safely find the fallback element
                                            const parent = target.parentElement;
                                            if (parent) {
                                                const fallbackElement = parent.querySelector('.fallback-icon');
                                                if (fallbackElement instanceof HTMLElement) {
                                                    fallbackElement.style.display = 'inline-flex';
                                                }
                                            }
                                        }}
                                    />
                                ) : null}
                                <div style={{ display: 'none' }} className="fallback-icon">
                                    {paymentMethod.fallbackIcon}
                                </div>
                                <span className="text-gray-800">{paymentMethod.name}</span>
                            </div>
                        </div>
                    )}

                    {/* Package Info - for deposit transactions */}
                    {transaction.type.toLowerCase() === 'deposit' && transaction.packageName && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600 font-medium">Gói dịch vụ</span>
                            <div className="text-sm font-medium text-blue-700">{transaction.packageName}</div>
                        </div>
                    )}

                    {/* Points - for exchange transactions */}
                    {transaction.type.toLowerCase() === 'exchange' && transaction.points !== undefined && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600 font-medium">Số điểm</span>
                            <div className="text-sm font-medium text-purple-700">{transaction.points} điểm</div>
                        </div>
                    )}

                    {/* Date */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">Thời gian</span>
                        <div className="flex items-center text-sm text-gray-800">
                            <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{formatDateTime(transaction.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Response Data - Only if it has content */}
                {transaction.responseData && transaction.responseData !== '{}' && (
                    <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-sm font-semibold text-gray-800">Dữ liệu phản hồi</h2>
                        </div>
                        <div className="p-4">
                            <pre className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto text-gray-700 max-h-40">
                                {transaction.responseData}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
