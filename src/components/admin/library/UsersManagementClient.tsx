'use client';

import React, { useState } from 'react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CheckBadgeIcon,
    NoSymbolIcon
} from '@heroicons/react/24/outline';

const libraryUsers = [
    {
        id: '1',
        name: 'Nguyễn Văn An',
        email: 'an.nguyenvan@example.com',
        userId: 'SV001',
        role: 'student',
        phone: '0901234567',
        status: 'active',
        totalBorrowed: 12,
        currentBorrowed: 2,
        joinDate: '2022-09-01',
    },
    {
        id: '2',
        name: 'Trần Thị Bình',
        email: 'binh.tranthi@example.com',
        userId: 'SV002',
        role: 'student',
        phone: '0907654321',
        status: 'active',
        totalBorrowed: 8,
        currentBorrowed: 1,
        joinDate: '2022-09-15',
    },
    {
        id: '3',
        name: 'Lê Văn Cường',
        email: 'cuong.levan@example.com',
        userId: 'GV001',
        role: 'teacher',
        phone: '0912345678',
        status: 'active',
        totalBorrowed: 24,
        currentBorrowed: 3,
        joinDate: '2021-05-20',
    },
    {
        id: '4',
        name: 'Phạm Thị Dung',
        email: 'dung.phamthi@example.com',
        userId: 'SV003',
        role: 'student',
        phone: '0923456789',
        status: 'blocked',
        totalBorrowed: 15,
        currentBorrowed: 0,
        joinDate: '2023-02-10',
    },
    {
        id: '5',
        name: 'Hoàng Văn Em',
        email: 'em.hoangvan@example.com',
        userId: 'SV004',
        role: 'student',
        phone: '0934567890',
        status: 'active',
        totalBorrowed: 5,
        currentBorrowed: 0,
        joinDate: '2023-08-05',
    },
];

const UsersManagementClient = () => {
    const [users, setUsers] = useState(libraryUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter users based on search term, role and status
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users based on sort field and direction
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (a[sortField] < b[sortField]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    const handleToggleStatus = (id) => {
        setUsers(users.map((user) =>
            user.id === id
                ? {
                    ...user,
                    status: user.status === 'active' ? 'blocked' : 'active'
                }
                : user
        ));
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Quản lý người dùng thư viện</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Danh sách tất cả người dùng có quyền mượn sách trong thư viện.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => {
                            setCurrentUser(null);
                            setShowAddModal(true);
                        }}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                        Thêm người dùng
                    </button>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="mb-4 flex justify-between items-center">
                            <div className="relative w-64">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                    placeholder="Tìm kiếm người dùng..."
                                />
                            </div>

                            <div className="flex space-x-4">
                                <div>
                                    <select
                                        id="roleFilter"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                        <option value="all">Tất cả vai trò</option>
                                        <option value="student">Sinh viên</option>
                                        <option value="teacher">Giảng viên</option>
                                        <option value="staff">Nhân viên</option>
                                    </select>
                                </div>

                                <div>
                                    <select
                                        id="statusFilter"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="active">Đang hoạt động</option>
                                        <option value="blocked">Đã khóa</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                Người dùng
                                                {sortField === 'name' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            onClick={() => handleSort('role')}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                Vai trò
                                                {sortField === 'role' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            onClick={() => handleSort('phone')}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                Liên hệ
                                                {sortField === 'phone' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            onClick={() => handleSort('currentBorrowed')}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                Đang mượn
                                                {sortField === 'currentBorrowed' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            onClick={() => handleSort('totalBorrowed')}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                Tổng mượn
                                                {sortField === 'totalBorrowed' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            onClick={() => handleSort('status')}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                Trạng thái
                                                {sortField === 'status' && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Thao tác</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {sortedUsers.length > 0 ? (
                                        sortedUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <UserIcon className="h-6 w-6 text-gray-500" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-gray-500">{user.userId}</div>
                                                            <div className="text-gray-500 text-xs">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="text-gray-900">
                                                        {user.role === 'student' ? 'Sinh viên' : user.role === 'teacher' ? 'Giảng viên' : 'Nhân viên'}
                                                    </div>
                                                    <div className="text-gray-500">Ngày tham gia: {new Date(user.joinDate).toLocaleDateString('vi-VN')}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                        <span>{user.phone}</span>
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                        <span className="truncate max-w-[180px]">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="text-center font-semibold">
                                                        {user.currentBorrowed > 0 ? (
                                                            <span className="text-blue-600">{user.currentBorrowed}</span>
                                                        ) : (
                                                            <span className="text-gray-400">0</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="text-center">
                                                        {user.totalBorrowed}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {user.status === 'active' ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            <CheckBadgeIcon className="h-4 w-4 mr-1" />
                                                            Đang hoạt động
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            <NoSymbolIcon className="h-4 w-4 mr-1" />
                                                            Đã khóa
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        className={`mr-2 text-${user.status === 'active' ? 'red' : 'green'}-600 hover:text-${user.status === 'active' ? 'red' : 'green'}-900`}
                                                    >
                                                        {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                                                Không tìm thấy dữ liệu người dùng nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {showAddModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {currentUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                                        </h3>
                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                    Họ và tên
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    defaultValue={currentUser?.name || ''}
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                                                        Mã người dùng
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="userId"
                                                        id="userId"
                                                        defaultValue={currentUser?.userId || ''}
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                                        Vai trò
                                                    </label>
                                                    <select
                                                        id="role"
                                                        name="role"
                                                        defaultValue={currentUser?.role || 'student'}
                                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    >
                                                        <option value="student">Sinh viên</option>
                                                        <option value="teacher">Giảng viên</option>
                                                        <option value="staff">Nhân viên</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    defaultValue={currentUser?.email || ''}
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    Số điện thoại
                                                </label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    defaultValue={currentUser?.phone || ''}
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                    Trạng thái
                                                </label>
                                                <select
                                                    id="status"
                                                    name="status"
                                                    defaultValue={currentUser?.status || 'active'}
                                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    <option value="active">Đang hoạt động</option>
                                                    <option value="blocked">Đã khóa</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    {currentUser ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagementClient;
