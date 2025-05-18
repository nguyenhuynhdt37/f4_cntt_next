'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    BellIcon,
    EnvelopeIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowLeftOnRectangleIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';

export default function AdminHeader() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

    return (
        <header className="bg-white shadow-sm z-20">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                {/* Left: Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-3">
                    {/* Notification button */}
                    <div className="relative">
                        <button
                            className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 relative"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <BellIcon className="h-6 w-6" />
                            <span className="absolute right-0 top-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        {/* Notification dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-30">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
                                        <button className="text-xs text-blue-600 hover:text-blue-800">
                                            Đánh dấu tất cả là đã đọc
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <a
                                            key={item}
                                            href="#"
                                            className="block p-4 border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out"
                                        >
                                            <div className="flex">
                                                <div className="shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <BellSolidIcon className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {item % 2 === 0 ? 'Người dùng mới đăng ký' : 'Bình luận mới trên khóa học'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {item} giờ trước
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                                <a href="#" className="block text-center text-sm text-blue-600 font-medium p-4 hover:bg-gray-50">
                                    Xem tất cả thông báo
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Messages button */}
                    <button className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100">
                        <EnvelopeIcon className="h-6 w-6" />
                    </button>

                    {/* User profile */}
                    <div className="relative inline-block">
                        <button
                            className="flex items-center space-x-3"
                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                        >
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                {user?.fullName ? user.fullName.charAt(0) : 'A'}
                            </div>
                            <div className="hidden md:block text-left">
                                <h3 className="text-sm font-medium text-gray-700">{user?.fullName || 'Admin User'}</h3>
                                <p className="text-xs text-gray-500">{user?.role || 'Quản trị viên'}</p>
                            </div>
                        </button>

                        {/* User dropdown */}
                        {showUserDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-30">
                                <div className="p-3 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Admin User'}</p>
                                    <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                                </div>
                                <div className="py-1">
                                    <Link href="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <UserCircleIcon className="h-4 w-4 mr-2 text-gray-500" />
                                        Hồ sơ cá nhân
                                    </Link>
                                    <button
                                        onClick={() => dispatch(logout())}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2 text-gray-500" />
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        {showMobileMenu ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-4 py-2 border-b border-gray-200 flex items-center text-sm">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link href="/admin" className="text-gray-500 hover:text-blue-600">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-900">Trang hiện tại</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            {/* Mobile menu */}
            {showMobileMenu && (
                <div className="md:hidden bg-white border-b border-gray-200 py-2">
                    <div className="px-4 space-y-1">
                        <a href="/admin" className="block py-2 px-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                            Dashboard
                        </a>
                        <a href="/admin/users" className="block py-2 px-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                            Người dùng
                        </a>
                        <a href="/admin/courses" className="block py-2 px-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                            Khóa học
                        </a>
                        <a href="/admin/posts" className="block py-2 px-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                            Bài viết
                        </a>
                        <a href="/admin/settings" className="block py-2 px-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                            Cài đặt
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
