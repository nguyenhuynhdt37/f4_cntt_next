'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    CreditCardIcon,
    UserIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { getTransactionById } from '@/api/axios/transactions';
import { formatCurrency, formatDateTime } from '@/utils/formatter';

type Transaction = {
    id: number;
    packageId: number;
    packageName: string;
    amount: number;
    paymentMethod: string;
    transactionCode: string;
    status: string;
    createdAt: string;
    responseData: string;
    user: string;
    user_id: number;
    user_email: string;
    user_fullname: string;
    user_avatar: string | null;
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
                const data = await getTransactionById(id);
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
                return <CalendarDaysIcon className="h-5 w-5 text-yellow-500" />;
            case 'failed':
            case 'cancelled':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            default:
                return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
        }
    };

    // Get payment method details
    const getPaymentMethod = (method: string) => {
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
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin giao dịch...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
                        <XCircleIcon className="h-10 w-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Không thể tải thông tin giao dịch</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        href="/admin/transactions"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Quay lại danh sách giao dịch
                    </Link>
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-6">
                        <InformationCircleIcon className="h-10 w-10 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy giao dịch</h2>
                    <p className="text-gray-600 mb-6">Giao dịch với ID {id} không tồn tại hoặc đã bị xóa.</p>
                    <Link
                        href="/admin/transactions"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Quay lại danh sách giao dịch
                    </Link>
                </div>
            </div>
        );
    }

    const paymentMethod = getPaymentMethod(transaction.paymentMethod);
    const statusColor = getStatusColor(transaction.status);
    const statusIcon = getStatusIcon(transaction.status);

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-6 px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="mr-4 bg-white/20 rounded-lg p-2">
                            <CreditCardIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Chi tiết giao dịch #{transaction.id}</h1>
                        </div>
                    </div>
                    <Link
                        href="/admin/transactions"
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Quay lại</span>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                {/* Transaction Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Transaction Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-800">Thông tin giao dịch</h2>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Status */}
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Trạng thái</span>
                                    <div className="flex items-center">
                                        {statusIcon}
                                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                                            {transaction.status === 'completed' ? 'Thành công' :
                                                transaction.status === 'pending' ? 'Đang xử lý' :
                                                    transaction.status === 'failed' ? 'Thất bại' :
                                                        transaction.status === 'cancelled' ? 'Đã hủy' : transaction.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Số tiền</span>
                                    <div className="text-lg font-semibold text-gray-900">{formatCurrency(transaction.amount)}</div>
                                </div>

                                {/* Transaction Code */}
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Mã giao dịch</span>
                                    <div className="font-medium text-gray-900">{transaction.transactionCode}</div>
                                </div>

                                {/* Payment method */}
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Phương thức thanh toán</span>
                                    <div className={`flex items-center ${paymentMethod.bgColor} px-3 py-2 rounded-lg`}>
                                        {paymentMethod.icon ? (
                                            <img
                                                src={paymentMethod.icon}
                                                alt={paymentMethod.name}
                                                className="h-5 w-5 mr-2"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    target.style.display = 'none';

                                                    // Safely find the fallback element and show it
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        const fallbackElement = parent.querySelector('.fallback-icon');
                                                        if (fallbackElement instanceof HTMLElement) {
                                                            fallbackElement.style.display = 'flex';
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

                                {/* Package Info */}
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Gói dịch vụ</span>
                                    <div>
                                        <Link href={`/admin/packages/${transaction.packageId}`} className="flex items-center text-blue-600 hover:text-blue-800">
                                            <span>{transaction.packageName}</span>
                                            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Thời gian</span>
                                    <div className="flex items-center text-gray-800">
                                        <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        <span>{formatDateTime(transaction.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Response Data - Only if it has content */}
                        {transaction.responseData && transaction.responseData !== '{}' && (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <h2 className="text-lg font-semibold text-gray-800">Dữ liệu phản hồi</h2>
                                </div>

                                <div className="p-6">
                                    <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto text-gray-700 max-h-60">
                                        {transaction.responseData}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - User Info */}
                    <div>
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-800">Thông tin người dùng</h2>
                            </div>

                            <div className="p-6">
                                {/* User avatar component */}
                                <div className="flex items-center mb-6">
                                    <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4 overflow-hidden">
                                        {transaction.user_avatar ? (
                                            <>
                                                <img
                                                    src={transaction.user_avatar}
                                                    alt={transaction.user_fullname}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.currentTarget;
                                                        target.style.display = 'none';

                                                        // Safely find the fallback element and show it
                                                        const parent = target.parentElement;
                                                        if (parent) {
                                                            const fallbackElement = parent.querySelector('.avatar-fallback');
                                                            if (fallbackElement instanceof HTMLElement) {
                                                                fallbackElement.style.display = 'flex';
                                                            }
                                                        }
                                                    }}
                                                />
                                                <div
                                                    style={{ display: 'none' }}
                                                    className="avatar-fallback h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-lg"
                                                >
                                                    {transaction.user_fullname?.substring(0, 1).toUpperCase() || transaction.user?.substring(0, 1).toUpperCase()}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-lg">
                                                {transaction.user_fullname?.substring(0, 1).toUpperCase() || transaction.user?.substring(0, 1).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{transaction.user_fullname}</h3>
                                        <p className="text-gray-500">@{transaction.user}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                        <span className="text-gray-600">Email</span>
                                        <span className="font-medium text-gray-800">{transaction.user_email}</span>
                                    </div>

                                    <div className="pt-2">
                                        <Link
                                            href={`/admin/users/${transaction.user_id}`}
                                            className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <UserIcon className="h-5 w-5 mr-2" />
                                            Xem thông tin người dùng
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 