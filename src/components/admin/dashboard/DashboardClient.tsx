'use client';

import React from 'react';
import {
    ArrowUpIcon,
    ArrowDownIcon,
    UsersIcon,
    BookOpenIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

// StatCard componen    t
interface StatCardProps {
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
    const isPositive = change >= 0;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="flex-grow">
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <div className="flex items-baseline">
                    <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
                    <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                        {isPositive ? (
                            <ArrowUpIcon className="h-3 w-3 mr-1" />
                        ) : (
                            <ArrowDownIcon className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(change)}%
                    </span>
                </div>
                <p className="text-gray-500 text-xs mt-1">So với tháng trước</p>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                {icon}
            </div>
        </div>
    );
};

// Chart component (placeholder)
interface ChartProps {
    title: string;
    subtitle: string;
}

const Chart: React.FC<ChartProps> = ({ title, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-400">Biểu đồ sẽ hiển thị ở đây</p>
        </div>
    </div>
);

// Recent Activity component
const RecentActivity = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        {item % 3 === 0 ? (
                            <UsersIcon className="h-5 w-5" />
                        ) : item % 3 === 1 ? (
                            <BookOpenIcon className="h-5 w-5" />
                        ) : (
                            <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-900 font-medium">
                            {item % 3 === 0
                                ? 'Người dùng mới đăng ký'
                                : item % 3 === 1
                                    ? 'Khóa học mới được tạo'
                                    : 'Bình luận mới được thêm'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {item} giờ trước
                        </p>
                    </div>
                </div>
            ))}
        </div>
        <button className="mt-4 text-sm text-blue-600 font-medium hover:text-blue-800">
            Xem tất cả hoạt động
        </button>
    </div>
);

const DashboardClient = () => {
    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                        Tạo báo cáo
                    </button>
                </div>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng người dùng"
                    value="24,592"
                    change={12}
                    icon={<UsersIcon className="h-6 w-6 text-white" />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Khóa học"
                    value="145"
                    change={8}
                    icon={<BookOpenIcon className="h-6 w-6 text-white" />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Bài viết"
                    value="862"
                    change={-3}
                    icon={<DocumentTextIcon className="h-6 w-6 text-white" />}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Bình luận"
                    value="5,927"
                    change={24}
                    icon={<ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />}
                    color="bg-pink-500"
                />
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <Chart
                    title="Người dùng đăng ký"
                    subtitle="Biểu đồ người dùng mới đăng ký theo thời gian"
                />
                <Chart
                    title="Khóa học tham gia"
                    subtitle="Biểu đồ số lượng đăng ký theo khóa học"
                />
            </div>

            {/* Activity section */}
            <div className="mt-8">
                <RecentActivity />
            </div>
        </div>
    );
};

export default DashboardClient;
