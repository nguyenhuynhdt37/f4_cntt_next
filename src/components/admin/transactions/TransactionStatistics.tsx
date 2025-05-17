'use client';

import React, { useState, useEffect } from 'react';
import {
    ArrowPathIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// Mock data for statistics
const mockStatistics = {
    totalTransactions: 24589,
    totalAmount: 1256780000,
    completedTransactions: 22145,
    completedAmount: 1187450000,
    pendingTransactions: 1895,
    pendingAmount: 45890000,
    failedTransactions: 549,
    failedAmount: 23440000,
    transactionsByType: [
        { type: 'deposit', count: 8975, amount: 645780000 },
        { type: 'withdrawal', count: 6543, amount: 378900000 },
        { type: 'payment', count: 7824, amount: 189560000 },
        { type: 'refund', count: 987, amount: 34780000 },
        { type: 'subscription', count: 260, amount: 7760000 },
    ],
    transactionsByDay: [
        { date: '2023-05-10', count: 845, amount: 34580000 },
        { date: '2023-05-11', count: 923, amount: 42670000 },
        { date: '2023-05-12', count: 876, amount: 39450000 },
        { date: '2023-05-13', count: 954, amount: 45670000 },
        { date: '2023-05-14', count: 1023, amount: 52340000 },
        { date: '2023-05-15', count: 876, amount: 38790000 },
        { date: '2023-05-16', count: 798, amount: 35670000 },
    ],
};

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    iconColor: string;
    change?: number;
    subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconColor, change, subtitle }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
                <div className={`shrink-0 rounded-full p-3 ${iconColor}`}>
                    {icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd>
                            <div className="text-xl font-semibold text-gray-900">{value}</div>
                        </dd>
                        {subtitle && (
                            <dd className="text-sm text-gray-500 mt-1">{subtitle}</dd>
                        )}
                        {change !== undefined && (
                            <div className="flex items-baseline">
                                <dd className={`text-sm font-medium flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {change >= 0 ? (
                                        <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                                    ) : (
                                        <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                                    )}
                                    {Math.abs(change)}%
                                </dd>
                                <dd className="ml-2 text-xs text-gray-500">
                                    so với tháng trước
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
};

const TransactionStatistics = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [statistics, setStatistics] = useState<typeof mockStatistics | null>(null);
    const [dateRange, setDateRange] = useState<{
        startDate: string;
        endDate: string;
    }>({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setIsLoading(true);

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));

                setStatistics(mockStatistics);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching transaction statistics:', error);
                setIsLoading(false);
            }
        };

        fetchStatistics();
    }, [dateRange]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'deposit':
                return 'Nạp tiền';
            case 'withdrawal':
                return 'Rút tiền';
            case 'payment':
                return 'Thanh toán';
            case 'refund':
                return 'Hoàn tiền';
            case 'subscription':
                return 'Đăng ký';
            default:
                return type;
        }
    };

    return (
        <div className="space-y-6">
            {/* Date range filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">Thống kê giao dịch</h2>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mr-2">
                                Từ:
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm"
                            />
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mr-2">
                                Đến:
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm"
                            />
                        </div>

                        <button
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md py-1.5 px-3 text-sm flex items-center"
                            onClick={() => {
                                setIsLoading(true);
                                // In a real app, this would trigger a new API call with the date range
                                setTimeout(() => {
                                    setStatistics(mockStatistics);
                                    setIsLoading(false);
                                }, 500);
                            }}
                        >
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            Cập nhật
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    // Loading skeletons
                    Array(4).fill(null).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="animate-pulse flex items-center">
                                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                <div className="ml-5 w-full space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : statistics ? (
                    <>
                        <StatCard
                            title="Tổng giao dịch"
                            value={formatNumber(statistics.totalTransactions)}
                            icon={<ChartBarIcon className="h-6 w-6 text-white" />}
                            iconColor="bg-blue-500"
                            subtitle={`Giá trị: ${formatCurrency(statistics.totalAmount)}`}
                            change={5.2}
                        />
                        <StatCard
                            title="Giao dịch hoàn thành"
                            value={formatNumber(statistics.completedTransactions)}
                            icon={<CheckCircleIcon className="h-6 w-6 text-white" />}
                            iconColor="bg-green-500"
                            subtitle={`Giá trị: ${formatCurrency(statistics.completedAmount)}`}
                            change={6.8}
                        />
                        <StatCard
                            title="Giao dịch đang xử lý"
                            value={formatNumber(statistics.pendingTransactions)}
                            icon={<ClockIcon className="h-6 w-6 text-white" />}
                            iconColor="bg-yellow-500"
                            subtitle={`Giá trị: ${formatCurrency(statistics.pendingAmount)}`}
                            change={-2.3}
                        />
                        <StatCard
                            title="Giao dịch thất bại"
                            value={formatNumber(statistics.failedTransactions)}
                            icon={<ExclamationTriangleIcon className="h-6 w-6 text-white" />}
                            iconColor="bg-red-500"
                            subtitle={`Giá trị: ${formatCurrency(statistics.failedAmount)}`}
                            change={-8.1}
                        />
                    </>
                ) : (
                    <div className="col-span-4 text-center py-10">
                        <p className="text-gray-500">Không có dữ liệu thống kê</p>
                    </div>
                )}
            </div>

            {/* Additional stats */}
            {!isLoading && statistics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Transactions by type */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Giao dịch theo loại</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Loại giao dịch
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Số lượng
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Giá trị
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tỷ lệ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {statistics.transactionsByType.map((item) => (
                                        <tr key={item.type} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {getTypeLabel(item.type)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatNumber(item.count)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(item.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {((item.count / statistics.totalTransactions) * 100).toFixed(1)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Transactions by day */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Giao dịch theo ngày</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Số lượng
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Giá trị
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {statistics.transactionsByDay.map((item) => (
                                        <tr key={item.date} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {new Date(item.date).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatNumber(item.count)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(item.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Charts placeholder */}
            {!isLoading && statistics && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Biểu đồ giao dịch theo thời gian</h3>
                    <div className="h-80 bg-gray-100 rounded flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <ChartBarIcon className="h-12 w-12 mx-auto text-gray-400" />
                            <p className="mt-2">Biểu đồ sẽ được hiển thị ở đây</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Biểu đồ thể hiện số lượng và giá trị giao dịch theo thời gian
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionStatistics;
