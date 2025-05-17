'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    XCircleIcon,
    DocumentTextIcon,
    UserIcon,
    CheckIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { createAuthor } from '@/api/axios/authors';

export default function AddAuthorForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox for isActive field
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
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

        if (!formData.name.trim()) {
            newErrors.name = 'Tên tác giả không được để trống';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả không được để trống';
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
            await createAuthor(formData);

            // Hiển thị thông báo thành công
            alert('Thêm tác giả mới thành công!');

            // Chuyển hướng về trang danh sách tác giả
            router.push('/admin/authors');
        } catch (error) {
            console.error('Lỗi khi thêm tác giả:', error);
            setErrors({
                form: 'Đã xảy ra lỗi khi thêm tác giả. Vui lòng thử lại.'
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 px-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Thêm tác giả mới</h1>
                    <Link
                        href="/admin/authors"
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Quay lại</span>
                    </Link>
                </div>
            </div>

            <div className="p-8">
                {errors.form && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start">
                        <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <div>
                            <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
                            <p className="text-red-600">{errors.form}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Author name field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên tác giả<span className="text-red-500">*</span>
                        </label>
                        <div className={`flex rounded-md shadow-sm ring-1 ring-inset ${errors.name ? 'ring-red-300' : 'ring-gray-300'} focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600`}>
                            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                <UserIcon className="h-5 w-5" />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                placeholder="Nhập tên tác giả"
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-red-500 text-sm flex items-center">
                                <XCircleIcon className="h-4 w-4 mr-1" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Author description field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả<span className="text-red-500">*</span>
                        </label>
                        <div className={`flex rounded-md shadow-sm ring-1 ring-inset ${errors.description ? 'ring-red-300' : 'ring-gray-300'} focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600`}>
                            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                <DocumentTextIcon className="h-5 w-5" />
                            </span>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                placeholder="Nhập mô tả chi tiết về tác giả"
                            />
                        </div>
                        {errors.description && (
                            <p className="mt-1 text-red-500 text-sm flex items-center">
                                <XCircleIcon className="h-4 w-4 mr-1" />
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Status field - Active/Inactive */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                                Kích hoạt
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Tác giả phải được kích hoạt để hiển thị trong hệ thống
                        </p>
                    </div>

                    {/* Helper text */}
                    <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                        <p className="flex items-center">
                            <InformationCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                            Các trường đánh dấu <span className="text-red-500 mx-1">*</span> là bắt buộc.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3">
                        <Link
                            href="/admin/authors"
                            className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                        >
                            Huỷ
                        </Link>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'transform transition hover:-translate-y-1'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-5 w-5 mr-2" />
                                    Thêm tác giả
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
