'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeftIcon,
    XCircleIcon,
    DocumentTextIcon,
    PhotoIcon,
    CheckIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { createSlide, ISlideCreate } from '@/api/axios/slides';

export default function AddSlideForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [overlayImagePreview, setOverlayImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        image: File | null;
        alt: string;
        overlayImage: File | null;
        isActive: boolean;
    }>({
        title: '',
        description: '',
        image: null,
        alt: '',
        overlayImage: null,
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

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, isOverlay = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: 'Chỉ chấp nhận file ảnh: JPG, PNG, GIF, WEBP'
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: 'File ảnh không được vượt quá 5MB'
            }));
            return;
        }

        // Update form data
        setFormData(prev => ({
            ...prev,
            [e.target.name]: file
        }));

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            if (isOverlay) {
                setOverlayImagePreview(reader.result as string);
            } else {
                setImagePreview(reader.result as string);
            }
        };
        reader.readAsDataURL(file);

        // Clear error
        if (errors[e.target.name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    }, [errors]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả không được để trống';
        }

        if (!formData.image) {
            newErrors.image = 'Hình ảnh slide không được để trống';
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
            // Prepare data for API
            const slideData: ISlideCreate = {
                title: formData.title,
                description: formData.description,
                image: formData.image!,
                alt: formData.alt || formData.title, // Use title as alt if not provided
                isActive: formData.isActive,
            };

            if (formData.overlayImage) {
                slideData.overlayImage = formData.overlayImage;
            }

            // Create new slide via API
            await createSlide(slideData);

            // Show success message
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
                            Thêm slide thành công!
                        </p>
                    </div>
                </div>
            `;
            document.body.appendChild(successMessage);

            setTimeout(() => {
                document.body.removeChild(successMessage);
                router.push('/admin/slides');
            }, 2000);
        } catch (error) {
            console.error('Lỗi khi thêm slide:', error);
            setErrors({
                form: 'Có lỗi xảy ra khi thêm slide. Vui lòng thử lại sau.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Link href="/admin/slides" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Thêm slide mới</h1>
                </div>
            </div>

            {errors.form && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{errors.form}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="p-6 space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Thông tin slide</h2>

                        {/* Tiêu đề */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md ${errors.title ? 'border-red-300' : 'border-gray-300'
                                        } shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm`}
                                    placeholder="Nhập tiêu đề slide"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                                )}
                            </div>
                        </div>

                        {/* Mô tả */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Mô tả <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <textarea
                                    name="description"
                                    id="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`block w-full rounded-md ${errors.description ? 'border-red-300' : 'border-gray-300'
                                        } shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm`}
                                    placeholder="Nhập mô tả cho slide"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Alt Text */}
                        <div>
                            <label htmlFor="alt" className="block text-sm font-medium text-gray-700">
                                Alt Text (Văn bản thay thế)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="alt"
                                    id="alt"
                                    value={formData.alt}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                    placeholder="Mô tả ngắn về hình ảnh (for accessibility)"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Sử dụng cho mục đích trợ năng, để mô tả hình ảnh cho người dùng sử dụng trình đọc màn hình
                            </p>
                        </div>

                        {/* Trạng thái */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                Hiển thị slide (Kích hoạt)
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="p-6 space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Hình ảnh slide</h2>

                        {/* Upload hình chính */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                Hình ảnh slide <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col space-y-2">
                                <div className={`border-2 border-dashed rounded-lg p-6 ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-500'
                                    } flex flex-col items-center justify-center transition-all`}>
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={(e) => handleImageChange(e)}
                                        className="sr-only"
                                    />
                                    <label htmlFor="image" className="w-full h-full cursor-pointer flex flex-col items-center">
                                        {imagePreview ? (
                                            <div className="relative w-full h-64">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Image preview"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="text-sm text-gray-500 text-center mt-2">
                                                    Click để tải lên hình ảnh slide<br />
                                                    <span className="text-xs">JPG, PNG, GIF hoặc WEBP (tối đa 5MB)</span>
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {errors.image && (
                                    <p className="text-sm text-red-500">{errors.image}</p>
                                )}
                                {imagePreview && (
                                    <button
                                        type="button"
                                        className="text-sm text-red-600 hover:text-red-800 self-start"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setFormData(prev => ({ ...prev, image: null }));
                                        }}
                                    >
                                        Xóa hình ảnh
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Upload hình overlay (optional) */}
                        <div>
                            <label htmlFor="overlayImage" className="block text-sm font-medium text-gray-700 mb-1">
                                Hình ảnh overlay (tùy chọn)
                            </label>
                            <div className="flex flex-col space-y-2">
                                <div className="border-2 border-dashed rounded-lg p-6 border-gray-300 hover:border-emerald-500 flex flex-col items-center justify-center transition-all">
                                    <input
                                        type="file"
                                        name="overlayImage"
                                        id="overlayImage"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={(e) => handleImageChange(e, true)}
                                        className="sr-only"
                                    />
                                    <label htmlFor="overlayImage" className="w-full h-full cursor-pointer flex flex-col items-center">
                                        {overlayImagePreview ? (
                                            <div className="relative w-full h-64">
                                                <Image
                                                    src={overlayImagePreview}
                                                    alt="Overlay image preview"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="text-sm text-gray-500 text-center mt-2">
                                                    Click để tải lên hình ảnh overlay (tùy chọn)<br />
                                                    <span className="text-xs">JPG, PNG, GIF hoặc WEBP (tối đa 5MB)</span>
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {errors.overlayImage && (
                                    <p className="text-sm text-red-500">{errors.overlayImage}</p>
                                )}
                                {overlayImagePreview && (
                                    <button
                                        type="button"
                                        className="text-sm text-red-600 hover:text-red-800 self-start"
                                        onClick={() => {
                                            setOverlayImagePreview(null);
                                            setFormData(prev => ({ ...prev, overlayImage: null }));
                                        }}
                                    >
                                        Xóa hình overlay
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Hình ảnh overlay sẽ được hiển thị đè lên hình ảnh chính với độ trong suốt (nếu cần)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6">
                    <Link
                        href="/admin/slides"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <CheckIcon className="-ml-1 mr-2 h-4 w-4" />
                                <span>Thêm slide</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
