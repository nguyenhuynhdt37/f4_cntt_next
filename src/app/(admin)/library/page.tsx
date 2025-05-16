import React from 'react';
import Link from 'next/link';
import { BookOpenIcon, BookmarkIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';

export const metadata = {
    title: 'Quản lý thư viện - F8 Admin',
    description: 'Hệ thống quản lý thư viện F8',
};

const stats = [
    { name: 'Tổng số sách', stat: '124', icon: <BookOpenIcon className="h-6 w-6 text-blue-600" /> },
    { name: 'Sách đang được mượn', stat: '42', icon: <BookmarkIcon className="h-6 w-6 text-indigo-600" /> },
    { name: 'Mượn quá hạn', stat: '7', icon: <ClockIcon className="h-6 w-6 text-red-600" /> },
    { name: 'Người mượn hoạt động', stat: '56', icon: <UsersIcon className="h-6 w-6 text-green-600" /> },
];

const LibraryDashboardPage = () => {
    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Quản lý thư viện</h1>

                {/* Stats */}
                <div className="mt-6">
                    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((item) => (
                            <div
                                key={item.name}
                                className="relative bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
                            >
                                <dt>
                                    <div className="absolute rounded-md p-3 bg-gray-50">
                                        {item.icon}
                                    </div>
                                    <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
                                </dt>
                                <dd className="ml-16 flex items-baseline">
                                    <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Library Management Options */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Link href="/admin/library/books" className="block">
                        <div className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                    <BookOpenIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Quản lý sách</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Thêm, sửa, xóa sách và quản lý thông tin sách trong thư viện
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/library/borrow" className="block">
                        <div className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    <BookmarkIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Quản lý mượn/trả</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Đăng ký mượn sách, xử lý trả sách và theo dõi quá hạn
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/library/users" className="block">
                        <div className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <UsersIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Quản lý người dùng</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Quản lý độc giả, phân quyền và theo dõi hoạt động mượn sách
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Activities */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h2>
                    <div className="mt-3 bg-white shadow overflow-hidden rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <li key={item} className="px-6 py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                {item % 2 === 0 ? (
                                                    <BookmarkIcon className="h-4 w-4 text-gray-600" />
                                                ) : (
                                                    <BookOpenIcon className="h-4 w-4 text-gray-600" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item % 2 === 0
                                                    ? 'Nguyễn Văn A mượn sách "Lập trình Python Cơ Bản"'
                                                    : 'Trần Thị B trả sách "Giáo Trình Java"'}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {new Date(Date.now() - item * 3600000).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryDashboardPage;
