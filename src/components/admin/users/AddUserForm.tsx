'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/api/axios/user';
import {
    UserCircleIcon,
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    XCircleIcon,
    ArrowLeftIcon,
    ShieldCheckIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

export default function AddUserForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        avatar: null as File | null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                [name]: file
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

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

        if (!formData.username.trim()) {
            newErrors.username = 'Vui lòng nhập tên đăng nhập';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên';
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (formData.password !== formData.confirmPassword) {
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
            // Create FormData for sending file
            const userData = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                fullName: formData.fullName,
                avatar: formData.avatar
            };

            await register(userData);

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
                            Thêm người dùng thành công!
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
            console.error('Lỗi khi tạo người dùng:', error);

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
                    form: apiMessage || 'Đã xảy ra lỗi. Vui lòng thử lại.',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            <h1 className="text-2xl font-bold text-gray-800">Thêm người dùng mới</h1>
                        </div>
                        <p className="text-gray-600 pl-10">Tạo tài khoản người dùng mới trong hệ thống</p>
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
                            {/* Avatar field */}
                            <div className="space-y-2 lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ảnh đại diện
                                </label>
                                <div className="flex items-center space-x-6">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                                        {formData.avatar ? (
                                            <img
                                                src={URL.createObjectURL(formData.avatar)}
                                                alt="Avatar preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserCircleIcon className="h-12 w-12 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="avatar-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Chọn ảnh
                                        </label>
                                        <input
                                            id="avatar-upload"
                                            name="avatar"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <p className="mt-1 pt-2 text-xs text-gray-500">PNG, JPG, GIF tối đa 1MB</p>
                                        {formData.avatar && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, avatar: null }))}
                                                className="mt-1 text-sm text-red-600 hover:text-red-800"
                                            >
                                                Xóa ảnh
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {errors.avatar && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.avatar}
                                    </p>
                                )}
                            </div>

                            {/* Username field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên đăng nhập<span className="text-red-500">*</span>
                                </label>
                                <div className={`flex rounded-md shadow-sm border ${errors.username ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}>
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <UserCircleIcon className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="tenhienthi"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.username}
                                    </p>
                                )}
                            </div>

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
                                    Mật khẩu<span className="text-red-500">*</span>
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
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900   placeholder:text-gray-400 focus:ring-0 sm:text-sm"
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
                                    Nhập lại mật khẩu<span className="text-red-500">*</span>
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
                                <li>Mật khẩu phải có ít nhất 6 ký tự.</li>
                                <li>Email sẽ được sử dụng để khôi phục mật khẩu.</li>
                            </ul>
                        </div>

                        {/* Submit button */}
                        <div className="flex justify-end">
                            <Link
                                href="/admin/users"
                                className="mr-4 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Huỷ
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'transform transition hover:-translate-y-1'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    'Thêm người dùng'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
