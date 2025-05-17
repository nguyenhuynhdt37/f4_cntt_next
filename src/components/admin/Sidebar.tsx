'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
// Temporary function until logout is properly implemented in authSlice
const logout = () => ({ type: 'auth/logout' });
import {
    Squares2X2Icon,
    UsersIcon,
    BookOpenIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    BellIcon,
    CogIcon,
    ArrowLeftOnRectangleIcon,
    BookmarkIcon,
    BuildingLibraryIcon,
    ReceiptRefundIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
    { icon: <Squares2X2Icon className="h-5 w-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <UsersIcon className="h-5 w-5" />, label: 'Người dùng', path: '/admin/users' },
    { icon: <BookmarkIcon className="h-5 w-5" />, label: 'Sách', path: '/admin/library/books' },
    { icon: <DocumentTextIcon className="h-5 w-5" />, label: 'Tài liệu', path: '/admin/documents' },
    { icon: <BookOpenIcon className="h-5 w-5" />, label: 'Danh mục', path: '/admin/categories' },
    { icon: <DocumentTextIcon className="h-5 w-5" />, label: 'Tác giả', path: '/admin/authors' },
    { icon: <BuildingLibraryIcon className="h-5 w-5" />, label: 'Nhà xuất bản', path: '/admin/publishers' },
    { icon: <ReceiptRefundIcon className="h-5 w-5" />, label: 'Mượn/Trả', path: '/admin/library/borrow' },
    { icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />, label: 'Bình luận', path: '/admin/comments' },
    { icon: <BellIcon className="h-5 w-5" />, label: 'Thông báo', path: '/admin/notifications' },
    { icon: <CogIcon className="h-5 w-5" />, label: 'Cài đặt', path: '/admin/settings' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin';
        }
        return pathname?.startsWith(path);
    };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`}>
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                {!collapsed && (
                    <Link href="/admin" className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-8 w-8 rounded-md flex items-center justify-center text-white text-lg font-bold mr-2">
                            <BookOpenIcon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-800 text-lg font-semibold leading-tight">Thư viện</span>
                            <span className="text-xs text-gray-500 -mt-1">Quản lý</span>
                        </div>
                    </Link>
                )}
                {collapsed && (
                    <div className="mx-auto bg-gradient-to-r from-blue-600 to-indigo-500 h-8 w-8 rounded-md flex items-center justify-center text-white">
                        <BookOpenIcon className="h-5 w-5" />
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className={`text-gray-500 hover:text-gray-700 ${collapsed ? 'mx-auto' : ''}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        {collapsed ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-grow overflow-y-auto scrollbar-custom py-4 flex flex-col">
                <ul className="space-y-1 px-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${isActive(item.path)
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span className={`${collapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User */}
            <div className="p-4 border-t border-gray-200">
                {collapsed ? (
                    <div className="flex flex-col items-center space-y-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-blue-100">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="Avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : user?.fullName || user?.username ? (
                                <div className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium text-xs">
                                    {user?.fullName?.substring(0, 2).toUpperCase() || user?.username?.substring(0, 2).toUpperCase()}
                                </div>
                            ) : (
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <UserCircleIcon className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => dispatch(logout())}
                            className="text-red-500 hover:text-red-700"
                        >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3 ring-2 ring-offset-1 ring-blue-100">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={`${user?.fullName || 'Admin'} avatar`}
                                    className="h-full w-full object-cover"
                                />
                            ) : user?.fullName || user?.username ? (
                                <div className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                                    {user?.fullName?.substring(0, 2).toUpperCase() || user?.username?.substring(0, 2).toUpperCase()}
                                </div>
                            ) : (
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <UserCircleIcon className="h-8 w-8" />
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <h4 className="text-sm font-medium text-gray-900">{user?.fullName || user?.username || 'Admin User'}</h4>
                            <p className="text-xs text-gray-500">{user?.email || 'admin@f8.edu.vn'}</p>
                        </div>
                        <button
                            onClick={() => dispatch(logout())}
                            className="text-red-500 hover:text-red-700"
                        >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
