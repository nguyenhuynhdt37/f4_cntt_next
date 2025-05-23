'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    XCircleIcon,
    DocumentTextIcon,
    FolderIcon,
    CheckIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
    BookOpenIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { getCategoryById, togleActive, updateCateGoryID } from '@/api/axios/categories';

type Category = {
    id: number;
    name: string;
    description: string;
    booksCount: number;
    createdAt: string;
    isActive: boolean;
};

export default function EditCategoryForm({ id }: { id: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categoryStats, setCategoryStats] = useState({
        booksCount: 0,
        createdAt: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
    });

    // Fetch category data (mockup for UI development)
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await getCategoryById(Number(id));
                console.log('Fetched category:', response);

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data for UI development

                // Set form data
                setFormData({
                    name: response.name,
                    description: response.description,
                    isActive: response.isActive,
                });

                // Set stats
                setCategoryStats({
                    booksCount: response.booksCount,
                    createdAt: response.createdAt
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching category:', error);
                setErrors({
                    form: 'Không thể tải thông tin danh mục. Vui lòng thử lại sau.'
                });
                setIsLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

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
    const handleChangeToggle = async () => {
        try {
            setIsTogglingStatus(true);
            await togleActive(Number(id));
            setFormData(prev => ({
                ...prev,
                isActive: !prev.isActive
            }));

            // Hiển thị thông báo thành công
            const newStatus = !formData.isActive;
            alert(`Danh mục đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} thành công!`);

        } catch (error) {
            console.error('Error toggling category status:', error);
            setErrors({
                form: 'Đã xảy ra lỗi khi thay đổi trạng thái danh mục. Vui lòng thử lại.'
            });
        } finally {
            setIsTogglingStatus(false);
        }
    }
    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên danh mục không được để trống';
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

        setIsSubmitting(true); try {
            // This is just for UI development, will be replaced with actual API call
            console.log('Update category:', { id, ...formData });

            await updateCateGoryID(Number(id), {
                name: formData.name,
                description: formData.description,
            });
            alert('Cập nhật danh mục thành công!');

            // Redirect back to categories list with success message
            router.push('/admin/categories');
        } catch (error) {
            console.error('Error updating category:', error);
            setErrors({
                form: 'Đã xảy ra lỗi khi cập nhật danh mục. Vui lòng thử lại.'
            });
        } finally {
            setIsSubmitting(false);
        }
    }; const handleDelete = async () => {
        try {
            setIsSubmitting(true);

            // This is just for UI development, will be replaced with actual API call
            console.log('Delete category:', id);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Hiển thị thông báo thành công
            alert('Xóa danh mục thành công!');

            // Redirect back to categories list with success message
            router.push('/admin/categories');
        } catch (error) {
            console.error('Error deleting category:', error);
            setErrors({
                form: 'Đã xảy ra lỗi khi xóa danh mục. Vui lòng thử lại.'
            });
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Đang tải thông tin danh mục...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-6 px-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Chỉnh sửa danh mục: {formData.name}</h1>
                    <Link
                        href="/admin/categories"
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

                {/* Category stats */}
                <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                    <h2 className="text-sm font-semibold text-emerald-800 mb-2">Thông tin danh mục</h2>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center text-emerald-700">
                            <BookOpenIcon className="h-5 w-5 mr-2 text-emerald-600" />
                            <span className="text-sm">
                                <span className="font-medium">{categoryStats.booksCount}</span> sách trong danh mục
                            </span>
                        </div>
                        <div className="flex items-center text-emerald-700">
                            <ClockIcon className="h-5 w-5 mr-2 text-emerald-600" />
                            <span className="text-sm">
                                Được tạo ngày <span className="font-medium">{new Date(categoryStats.createdAt).toLocaleDateString('vi-VN')}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category name field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên danh mục<span className="text-red-500">*</span>
                        </label>
                        <div className={`flex rounded-md shadow-sm ring-1 ring-inset ${errors.name ? 'ring-red-300' : 'ring-gray-300'} focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-600`}>
                            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                <FolderIcon className="h-5 w-5" />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                placeholder="Nhập tên danh mục"
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-red-500 text-sm flex items-center">
                                <XCircleIcon className="h-4 w-4 mr-1" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Category description field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả<span className="text-red-500">*</span>
                        </label>
                        <div className={`flex rounded-md shadow-sm ring-1 ring-inset ${errors.description ? 'ring-red-300' : 'ring-gray-300'} focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-600`}>
                            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                <DocumentTextIcon className="h-5 w-5" />
                            </span>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                placeholder="Nhập mô tả chi tiết về danh mục"
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
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Trạng thái danh mục
                        </label>
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={handleChangeToggle}
                                disabled={isTogglingStatus}
                                className={`px-4 py-2.5 rounded-md font-medium text-sm shadow-sm transition-all duration-200 flex items-center gap-2 ${isTogglingStatus
                                    ? 'bg-gray-400 cursor-not-allowed text-white opacity-80'
                                    : formData.isActive
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                        : 'bg-gray-300 hover:bg-gray-400 text-white'
                                    }`}
                                aria-pressed={formData.isActive}
                            >
                                {isTogglingStatus ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : formData.isActive ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Đang kích hoạt</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Đã vô hiệu hóa</span>
                                    </>
                                )}
                            </button>

                            <div className="ml-4 bg-gray-50 p-3 rounded-lg flex items-start">
                                <InformationCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium">Trạng thái: {formData.isActive ? 'Hoạt động' : 'Không hoạt động'}</p>
                                    <p>Danh mục phải được kích hoạt để hiển thị trong hệ thống</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Helper text */}
                    <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                        <p className="flex items-center">
                            <InformationCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                            Các trường đánh dấu <span className="text-red-500 mx-1">*</span> là bắt buộc.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center text-sm justify-between">
                        <button
                            disabled={isSubmitting || categoryStats.booksCount > 0}
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        >
                            <ExclamationTriangleIcon className="h-5 w-5" />
                            Xóa danh mục
                        </button>

                        <div className="flex space-x-3">
                            <Link
                                href="/admin/categories"
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                            >
                                Huỷ
                            </Link>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 
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
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3 text-red-600">
                                    <ExclamationTriangleIcon className="h-8 w-8" />
                                    <h3 className="text-xl font-bold">Xác nhận xóa</h3>
                                </div>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg mt-4 mb-4">
                                <p className="text-red-800">
                                    Bạn có chắc chắn muốn xóa danh mục <span className="font-semibold">{formData.name}</span>?
                                </p>
                            </div>

                            {categoryStats.booksCount > 0 && (
                                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-sm text-amber-700 my-4">
                                    <p className="flex items-start">
                                        <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                        <span>
                                            <strong>Cảnh báo:</strong> Danh mục này đang chứa {categoryStats.booksCount} sách.
                                            Việc xóa danh mục có thể ảnh hưởng đến các sách đang liên kết.
                                        </span>
                                    </p>
                                </div>
                            )}

                            <div className="mt-2">
                                <p className="text-gray-600">
                                    Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến danh mục này sẽ bị xóa vĩnh viễn.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all transform hover:-translate-y-0.5"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xóa...
                                        </div>
                                    ) : (
                                        'Xác nhận xóa'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
