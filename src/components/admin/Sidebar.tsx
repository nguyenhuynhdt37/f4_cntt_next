'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import img from 'next/img';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { logout } from '@/redux/slices/authSlice';
import {
    Squares2X2Icon,
    UsersIcon,
    BookOpenIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    BellIcon,
    CogIcon,
    ChevronDownIcon,
    ArrowLeftOnRectangleIcon,
    BookmarkIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
    { icon: <Squares2X2Icon className="h-5 w-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <UsersIcon className="h-5 w-5" />, label: 'Người dùng', path: '/admin/users' },
    {
        icon: <BookmarkIcon className="h-5 w-5" />,
        label: 'Thư viện',
        path: '/admin/library',
        submenu: [
            { label: 'Tổng quan', path: '/admin/library' },
            { label: 'Quản lý sách', path: '/admin/library/books' },
            { label: 'Quản lý mượn/trả', path: '/admin/library/borrow' },
        ]
    },
    {
        icon: <BookOpenIcon className="h-5 w-5" />,
        label: 'Khóa học',
        path: '/admin/courses',
        submenu: [
            { label: 'Tất cả khóa học', path: '/admin/courses' },
            { label: 'Thêm khóa học', path: '/admin/courses/create' },
            { label: 'Danh mục', path: '/admin/courses/categories' },
        ]
    },
    {
        icon: <DocumentTextIcon className="h-5 w-5" />,
        label: 'Bài viết',
        path: '/admin/posts',
        submenu: [
            { label: 'Tất cả bài viết', path: '/admin/posts' },
            { label: 'Thêm bài viết', path: '/admin/posts/create' },
            { label: 'Danh mục', path: '/admin/posts/categories' },
        ]
    },
    { icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />, label: 'Bình luận', path: '/admin/comments' },
    { icon: <BellIcon className="h-5 w-5" />, label: 'Thông báo', path: '/admin/notifications' },
    { icon: <CogIcon className="h-5 w-5" />, label: 'Cài đặt', path: '/admin/settings' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [collapsed, setCollapsed] = useState(false);

    const toggleSubmenu = (path: string) => {
        setOpenSubmenu(openSubmenu === path ? null : path);
    };

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
                        <div className="bg-blue-600 h-8 w-8 rounded-md flex items-center justify-center text-white text-lg font-bold mr-2">
                            F8
                        </div>
                        <span className="text-gray-800 text-lg font-semibold">Admin</span>
                    </Link>
                )}
                {collapsed && (
                    <div className="mx-auto bg-blue-600 h-8 w-8 rounded-md flex items-center justify-center text-white text-lg font-bold">
                        F8
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
                            {item.submenu ? (
                                <>
                                    <button
                                        onClick={() => toggleSubmenu(item.path)}
                                        className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${isActive(item.path)
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        {!collapsed && (
                                            <>
                                                <span className="flex-grow">{item.label}</span>
                                                <ChevronDownIcon
                                                    className={`h-4 w-4 transition-transform duration-200 ${openSubmenu === item.path ? 'transform rotate-180' : ''
                                                        }`}
                                                />
                                            </>
                                        )}
                                    </button>
                                    {!collapsed && openSubmenu === item.path && (
                                        <ul className="mt-1 pl-10 space-y-1">
                                            {item.submenu.map((subitem) => (
                                                <li key={subitem.path}>
                                                    <Link
                                                        href={subitem.path}
                                                        className={`block px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${pathname === subitem.path
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {subitem.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
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
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User */}
            <div className="p-4 border-t border-gray-200">
                {collapsed ? (
                    <button
                        onClick={() => dispatch(logout())}
                        className="w-full flex justify-center items-center text-red-500 hover:text-red-700"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    </button>
                ) : (
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm mr-3">
                            {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                        </div>
                        <div className="flex-grow">
                            <h4 className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</h4>
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
