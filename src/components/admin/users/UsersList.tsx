'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    UserCircleIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { getUser, toggleActive, deleteUser } from '@/api/axios/user';

type User = {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    avatarUrl?: string;
    canDelete: boolean;
    avatar?: string;
};

type SortField = 'username' | 'email' | 'fullName' | 'role' | 'createdAt' | 'isActive';

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('username');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
    const pageSize = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const res = await getUser({
                    page: currentPage,
                    size: pageSize,
                    search: searchQuery,
                    sortDirection: sortDirection,
                    sortField: sortField
                });

                setUsers(res.items);
                setTotalPages(res.totalPages);
                setTotalItems(res.totalItems);
            } catch (err) {
                console.error('Lỗi khi tải danh sách người dùng:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, searchQuery, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            setTogglingUserId(userId);
            await toggleActive(userId);
            const updatedUsers = users.map(user =>
                user.id === userId
                    ? { ...user, isActive: !user.isActive }
                    : user
            );
            setUsers(updatedUsers);
            alert(`Đã ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'} người dùng thành công!`);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái người dùng:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái người dùng');
        } finally {
            setTogglingUserId(null);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(user => user.id !== userId));
                alert('Xóa người dùng thành công!');
            } catch (error) {
                console.error('Lỗi khi xóa người dùng:', error);
                alert('Có lỗi xảy ra khi xóa người dùng');
            }
        }
    };

    // Get role badge color
    const getRoleBadgeClass = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'librarian':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header và actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-sm">
                                <UserCircleIcon className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
                        </div>
                        <p className="text-gray-600 pl-10">Quản lý tất cả người dùng trong hệ thống</p>
                    </div>
                    <Link
                        href="/admin/users/add"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transform transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Thêm người dùng
                    </Link>
                </div>
            </div>

            {/* Filter và search */}
            <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng theo tên, email..."
                            value={searchQuery}
                            onChange={e => {
                                setCurrentPage(1); // reset về trang đầu khi tìm kiếm
                                setSearchQuery(e.target.value);
                            }}
                            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
                        <div className="bg-blue-100 text-blue-800 p-1.5 rounded-full mr-2">
                            <UserCircleIcon className="h-5 w-5" />
                        </div>
                        <span>Tổng số: <strong>{totalItems}</strong> người dùng</span>
                    </div>
                </div>
            </div>

            {/* Trạng thái loading */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[40vh] bg-white rounded-xl shadow-sm">
                    <div className="relative w-20 h-20">
                        <div className="w-20 h-20 rounded-full border-4 border-blue-200"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 text-gray-500 font-medium text-xl">Đang tải người dùng...</p>
                    <p className="text-gray-400 italic mt-2">Vui lòng đợi trong giây lát</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('username')}>
                                        <div className="flex items-center gap-1">
                                            <span>Avatar & Tên đăng nhập</span>
                                            {getSortIcon('username')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('email')}>
                                        <div className="flex items-center gap-1">
                                            <span>Email</span>
                                            {getSortIcon('email')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('fullName')}>
                                        <div className="flex items-center gap-1">
                                            <span>Họ và tên</span>
                                            {getSortIcon('fullName')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('role')}>
                                        <div className="flex items-center gap-1">
                                            <span>Vai trò</span>
                                            {getSortIcon('role')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('createdAt')}>
                                        <div className="flex items-center gap-1">
                                            <span>Ngày tạo</span>
                                            {getSortIcon('createdAt')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('isActive')}>
                                        <div className="flex items-center gap-1">
                                            <span>Trạng thái</span>
                                            {getSortIcon('isActive')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 ring-2 ring-offset-2 ring-blue-100 rounded-full overflow-hidden shadow-sm">
                                                        {user.avatarUrl || user.avatar ? (
                                                            <img
                                                                src={user.avatarUrl || user.avatar}
                                                                alt={`${user.username} avatar`}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                                                                <UserCircleIcon className="h-6 w-6 text-blue-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                                        <EnvelopeIcon className="h-4 w-4" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm text-gray-600">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${user.isActive
                                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                                                    : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border border-gray-200'
                                                    }`}>
                                                    <span className={`h-2 w-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                    {user.isActive ? 'Kích hoạt' : 'Chưa kích hoạt'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={`/admin/users/edit/${user.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md transition-colors"
                                                        title="Sửa"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </Link>

                                                    {user.isActive ? (
                                                        <button
                                                            onClick={() => handleToggleStatus(user.id, true)}
                                                            className={`p-1.5 rounded-md transition-colors ${togglingUserId === user.id ? 'bg-gray-200 cursor-not-allowed opacity-70' : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-900'}`}
                                                            title="Vô hiệu hóa"
                                                            disabled={togglingUserId === user.id}
                                                        >
                                                            {togglingUserId === user.id ? (
                                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleToggleStatus(user.id, false)}
                                                            className={`p-1.5 rounded-md transition-colors ${togglingUserId === user.id ? 'bg-gray-200 cursor-not-allowed opacity-70' : 'bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-900'}`}
                                                            title="Kích hoạt"
                                                            disabled={togglingUserId === user.id}
                                                        >
                                                            {togglingUserId === user.id ? (
                                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    )}

                                                    <button
                                                        disabled={user.canDelete}
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className={`p-1.5 rounded-md transition-colors ${user.canDelete ? 'cursor-not-allowed bg-amber-50 *:hover:bg-amber-100 text-amber-600 hover:text-amber-900' : " bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-900"}`}
                                                        title="Xóa"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <UserCircleIcon className="h-12 w-12 text-gray-300 mb-2" />
                                                <p className="text-gray-500 text-lg font-medium mb-1">Không tìm thấy người dùng nào</p>
                                                <p className="text-gray-400">Hãy thay đổi bộ lọc hoặc tạo người dùng mới</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                            <div className="hidden sm:block">
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> trong <span className="font-medium">{totalItems}</span> kết quả
                                </p>
                            </div>

                            <div className="flex-1 flex justify-center sm:justify-end">
                                <nav className="relative z-0 inline-flex shadow-sm rounded-md space-x-1">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm font-medium transform transition-all duration-200 ${currentPage === 1
                                            ? 'text-gray-300 cursor-not-allowed border-gray-200 bg-gray-50'
                                            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 border-gray-300 bg-white'
                                            }`}
                                    >
                                        <span className="sr-only">Trước</span>
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${page === currentPage
                                                    ? 'z-10 bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 text-white shadow-sm'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-3 py-2 rounded-r-md border text-sm font-medium transform transition-all duration-200 ${currentPage === totalPages
                                            ? 'text-gray-300 cursor-not-allowed border-gray-200 bg-gray-50'
                                            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 border-gray-300 bg-white'
                                            }`}
                                    >
                                        <span className="sr-only">Sau</span>
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
}
