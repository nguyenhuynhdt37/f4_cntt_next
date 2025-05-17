'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    UserCircleIcon,
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    XCircleIcon,
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { getUserById, updateUser as updateUserApi, toggleActive as toggleActiveApi, deleteUser as deleteUserApi } from '@/api/axios/user';

type User = {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'admin' | 'user' | 'librarian';
    isActive: boolean;
    dateCreated: string;
    lastLogin: string;
};

export default function EditUserForm({ id }: { id: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        isActive: true,
        avatar: null as File | null,
        avatarUrl: '' // URL hiện tại của avatar từ server
    });

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserById(id);
                console.log('User data:', res);

                setFormData({
                    username: res.username,
                    email: res.email,
                    fullName: res.fullName,
                    password: '',
                    confirmPassword: '',
                    role: res.role || 'user',
                    isActive: res.isActive !== undefined ? res.isActive : true,
                    avatar: null,
                    avatarUrl: res.avatarUrl || '' // Lấy URL avatar từ response
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user:', error);
                router.push('/admin/users');
            }
        };

        fetchUser();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox for isActive field
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        }
        // Handle file upload for avatar
        else if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            const file = files ? files[0] : null;
            setFormData(prev => ({
                ...prev,
                avatar: file,
                avatarUrl: file ? URL.createObjectURL(file) : prev.avatarUrl
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Họ và tên không được để trống';
        }

        // Only validate password if one has been entered (allows updating without changing password)
        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Update user data with avatar if available
            await updateUserApi(id, {
                id,
                email: formData.email,
                fullName: formData.fullName,
                isActive: formData.isActive,
                password: formData.password || undefined, // Only send password if it's provided
                avatar: formData.avatar || undefined // Only send avatar if it's provided
            });


            // Hiển thị thông báo thành công
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed top-4 right-4 bg-white border-l-4 border-green-500 shadow-lg rounded-lg px-6 py-4 z-50 animate-fadeIn';
            successMessage.innerHTML = `
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-green-800">
                            Cập nhật người dùng thành công!
                        </p>
                    </div>
                </div>
            `;
            document.body.appendChild(successMessage);

            // Xóa thông báo sau 3 giây
            setTimeout(() => {
                document.body.removeChild(successMessage);
                router.push('/admin/users');
            }, 2000);

        } catch (error: any) {
            console.error('Lỗi khi cập nhật người dùng:', error);

            const response = error.response;
            const apiErrors = response?.data?.errors;
            const apiMessage = response?.data?.message;

            if (apiErrors && typeof apiErrors === 'object') {
                const fieldErrors: Record<string, string> = {};
                for (const key in apiErrors) {
                    if (Array.isArray(apiErrors[key])) {
                        fieldErrors[key] = apiErrors[key][0];
                    }
                }
                setErrors(fieldErrors);
            } else {
                setErrors({
                    form: apiMessage || 'Đã xảy ra lỗi khi cập nhật người dùng. Vui lòng thử lại.',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUserApi(id);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Hiển thị thông báo thành công
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed top-4 right-4 bg-white border-l-4 border-green-500 shadow-lg rounded-lg px-6 py-4 z-50 animate-fadeIn';
            successMessage.innerHTML = `
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-green-800">
                            Xóa người dùng thành công!
                        </p>
                    </div>
                </div>
            `;
            document.body.appendChild(successMessage);

            // Xóa thông báo sau 3 giây
            setTimeout(() => {
                document.body.removeChild(successMessage);
                router.push('/admin/users');
            }, 2000);

        } catch (error: any) {
            console.error('Lỗi khi xóa người dùng:', error);
            const response = error.response;
            const apiMessage = response?.data?.message;

            setErrors({
                form: apiMessage || 'Đã xảy ra lỗi khi xóa người dùng. Vui lòng thử lại.'
            });
            setShowDeleteConfirm(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Đang tải thông tin người dùng...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header với gradient và actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-sm">
                                <UserCircleIcon className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa người dùng: {formData.username}</h1>
                        </div>
                        <p className="text-gray-600 pl-10">Cập nhật thông tin cho người dùng: <span className="font-medium">{formData.username}</span></p>
                    </div>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Quay lại danh sách</span>
                    </Link>
                </div>
            </div>

            {/* Form chính */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                    {errors.form && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
                            <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                            <div>
                                <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
                                <p className="text-red-600">{errors.form}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Email field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email<span className="text-red-500">*</span>
                                </label>
                                <div className={`flex rounded-md shadow-sm border ${errors.email ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}>
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <EnvelopeIcon className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Full Name field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ và tên<span className="text-red-500">*</span>
                                </label>
                                <div className={`flex rounded-md shadow-sm border ${errors.fullName ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}>
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <UserIcon className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>

                            {/* Password field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu mới
                                </label>
                                <div className={`flex rounded-md shadow-sm border ${errors.password ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}>
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <LockClosedIcon className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="••••••"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Xác nhận mật khẩu mới
                                </label>
                                <div className={`flex rounded-md shadow-sm border ${errors.confirmPassword ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}>
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <LockClosedIcon className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="••••••"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Active Status */}
                        <div className="mt-4">
                            <div className="flex items-center">
                                <input
                                    id="isActive"
                                    name="isActive"
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                                    Kích hoạt tài khoản
                                </label>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Người dùng sẽ có thể đăng nhập nếu tùy chọn này được chọn.
                            </p>
                        </div>

                        {/* Avatar upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ảnh đại diện
                            </label>
                            <div className="flex items-center gap-4">
                                {/* Hiển thị ảnh đại diện hiện tại */}
                                {formData.avatarUrl ? (
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                                        <img
                                            src={formData.avatarUrl}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300">
                                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}

                                <label className="flex-1">
                                    <span className="sr-only">Chọn ảnh đại diện</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setFormData(prev => ({
                                                ...prev,
                                                avatar: file,
                                                avatarUrl: file ? URL.createObjectURL(file) : ''
                                            }));
                                        }}
                                        className="block w-full text-sm text-gray-900 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-gray-50 hover:file:bg-gray-100 focus:ring-0"
                                    />
                                </label>
                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                                Định dạng: JPG, PNG. Kích thước tối đa: 2MB.
                            </p>

                            {errors.avatar && (
                                <p className="mt-1 text-red-500 text-sm flex items-center">
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    {errors.avatar}
                                </p>
                            )}
                        </div>

                        {/* Helper text */}
                        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2 text-blue-700 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">Thông tin quan trọng</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Tất cả các trường đánh dấu <span className="text-red-500">*</span> là bắt buộc.</li>
                                <li>Để giữ nguyên mật khẩu, hãy để trống các trường mật khẩu.</li>
                                <li>Mật khẩu mới phải có ít nhất 6 ký tự.</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex text-sm items-center justify-between pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center gap-1.5 px-5 py-2.5 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                            >
                                <ExclamationTriangleIcon className="h-5 w-5" />
                                Xóa người dùng
                            </button>

                            <div className="flex space-x-3">
                                <Link
                                    href="/admin/users"
                                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                                >
                                    Huỷ
                                </Link>

                                <button
                                    type="submit"
                                    // onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'transform transition hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang lưu...
                                        </div>
                                    ) : (
                                        'Lưu thay đổi'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <ExclamationTriangleIcon className="h-8 w-8" />
                            <h3 className="text-xl font-bold">Xác nhận xóa</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-700">
                                Bạn có chắc chắn muốn xóa người dùng <span className="font-medium">{formData.username}</span> không? Hành động này không thể hoàn tác.
                            </p>

                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-sm text-amber-700">
                                <p className="font-medium mb-1">Cảnh báo:</p>
                                <p>Nếu người dùng này có hoạt động trong quá khứ, bạn nên hủy kích hoạt tài khoản thay vì xóa hoàn toàn.</p>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Xóa người dùng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
