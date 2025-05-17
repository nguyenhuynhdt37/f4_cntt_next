'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeftIcon,
    XCircleIcon,
    BookOpenIcon,
    UserIcon,
    BuildingLibraryIcon,
    CheckIcon,
    InformationCircleIcon,
    PhotoIcon,
    MapPinIcon,
    BookmarkIcon,
    CalculatorIcon,
    IdentificationIcon,
    CalendarIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

interface Category {
    id: number;
    name: string;
}

interface Author {
    id: number;
    name: string;
}

interface Publisher {
    id: number;
    name: string;
}

export default function AddBookForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        isbn: '',
        quantity: 1,
        location: '',
        description: '',
        publishDate: '',
        authorId: '',
        publisherId: '',
        categoryId: '',
        coverImage: null as File | null,
        pages: '',
        language: 'Vietnamese',
    });

    // Load categories, authors, and publishers
    useEffect(() => {
        const loadOptions = async () => {
            setIsLoadingOptions(true);
            try {
                // In a real implementation, these would be API calls
                // For now, using placeholder data
                setCategories([
                    { id: 1, name: 'Công nghệ thông tin' },
                    { id: 2, name: 'Khoa học dữ liệu' },
                    { id: 3, name: 'Ngôn ngữ lập trình' },
                    { id: 4, name: 'Mạng máy tính' },
                    { id: 5, name: 'Trí tuệ nhân tạo' },
                ]);

                setAuthors([
                    { id: 1, name: 'Nguyễn Văn A' },
                    { id: 2, name: 'Trần Thị B' },
                    { id: 3, name: 'Lê Văn C' },
                    { id: 4, name: 'Phạm Thị D' },
                ]);

                setPublishers([
                    { id: 1, name: 'NXB Giáo dục' },
                    { id: 2, name: 'NXB Khoa học Kỹ thuật' },
                    { id: 3, name: 'NXB Đại học Quốc gia' },
                    { id: 4, name: 'NXB Thông tin và Truyền thông' },
                ]);
            } catch (error) {
                console.error('Error loading options:', error);
                setErrors(prev => ({
                    ...prev,
                    general: 'Không thể tải thông tin danh mục, tác giả, nhà xuất bản.'
                }));
            } finally {
                setIsLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                coverImage: 'Chỉ chấp nhận file ảnh: JPG, PNG, GIF, WEBP'
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                coverImage: 'File ảnh không được vượt quá 5MB'
            }));
            return;
        }

        // Update form data
        setFormData(prev => ({
            ...prev,
            coverImage: file
        }));

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Clear error
        if (errors.coverImage) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.coverImage;
                return newErrors;
            });
        }
    }, [errors]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống';
        }

        if (!formData.isbn.trim()) {
            newErrors.isbn = 'ISBN không được để trống';
        } else if (!/^(?:\d{10}|\d{13}|(?=(?:\D*\d){10}(?:\D*\d){3}?$)[\d-]{14,17})$/.test(formData.isbn.replace(/-/g, ''))) {
            newErrors.isbn = 'ISBN phải có 10 hoặc 13 chữ số';
        }

        if (!formData.quantity || parseInt(formData.quantity.toString()) < 1) {
            newErrors.quantity = 'Số lượng phải lớn hơn 0';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Vị trí không được để trống';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả không được để trống';
        }

        if (!formData.publishDate.trim()) {
            newErrors.publishDate = 'Ngày xuất bản không được để trống';
        }

        if (!formData.authorId) {
            newErrors.authorId = 'Vui lòng chọn tác giả';
        }

        if (!formData.publisherId) {
            newErrors.publisherId = 'Vui lòng chọn nhà xuất bản';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Vui lòng chọn danh mục';
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
            // This is just for UI development, will be replaced with actual API call
            console.log('Create book:', formData);

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
                            Thêm sách thành công!
                        </p>
                    </div>
                </div>
            `;
            document.body.appendChild(successMessage);

            setTimeout(() => {
                document.body.removeChild(successMessage);
                router.push('/admin/library/books');
            }, 2000);
        } catch (error) {
            console.error('Lỗi khi thêm sách:', error);
            setErrors({
                form: 'Có lỗi xảy ra khi thêm sách. Vui lòng thử lại sau.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Link href="/admin/library/books" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Thêm sách mới</h1>
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
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <BookOpenIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Thông tin cơ bản
                        </h2>

                        {/* Two columns layout for desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                        placeholder="Nhập tiêu đề sách"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                                    )}
                                </div>
                            </div>

                            {/* ISBN */}
                            <div>
                                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                                    ISBN <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex">
                                    <div className="relative flex items-center flex-grow">
                                        <IdentificationIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="isbn"
                                            id="isbn"
                                            value={formData.isbn}
                                            onChange={handleChange}
                                            className={`pl-10 block w-full rounded-md ${errors.isbn ? 'border-red-300' : 'border-gray-300'
                                                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                            placeholder="Ví dụ: 978-3-16-148410-0"
                                        />
                                    </div>
                                </div>
                                {errors.isbn && (
                                    <p className="mt-1 text-sm text-red-500">{errors.isbn}</p>
                                )}
                            </div>

                            {/* Danh mục */}
                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex">
                                    <div className="relative flex items-center flex-grow">
                                        <BookmarkIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                                        <select
                                            id="categoryId"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleChange}
                                            className={`pl-10 block w-full rounded-md ${errors.categoryId ? 'border-red-300' : 'border-gray-300'
                                                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                            disabled={isLoadingOptions}
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {errors.categoryId && (
                                    <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
                                )}
                            </div>

                            {/* Tác giả */}
                            <div>
                                <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">
                                    Tác giả <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex">
                                    <div className="relative flex items-center flex-grow">
                                        <UserIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                                        <select
                                            id="authorId"
                                            name="authorId"
                                            value={formData.authorId}
                                            onChange={handleChange}
                                            className={`pl-10 block w-full rounded-md ${errors.authorId ? 'border-red-300' : 'border-gray-300'
                                                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                            disabled={isLoadingOptions}
                                        >
                                            <option value="">Chọn tác giả</option>
                                            {authors.map(author => (
                                                <option key={author.id} value={author.id}>
                                                    {author.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {errors.authorId && (
                                    <p className="mt-1 text-sm text-red-500">{errors.authorId}</p>
                                )}
                            </div>

                            {/* Nhà xuất bản */}
                            <div>
                                <label htmlFor="publisherId" className="block text-sm font-medium text-gray-700">
                                    Nhà xuất bản <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex">
                                    <div className="relative flex items-center flex-grow">
                                        <BuildingLibraryIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                                        <select
                                            id="publisherId"
                                            name="publisherId"
                                            value={formData.publisherId}
                                            onChange={handleChange}
                                            className={`pl-10 block w-full rounded-md ${errors.publisherId ? 'border-red-300' : 'border-gray-300'
                                                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                            disabled={isLoadingOptions}
                                        >
                                            <option value="">Chọn nhà xuất bản</option>
                                            {publishers.map(publisher => (
                                                <option key={publisher.id} value={publisher.id}>
                                                    {publisher.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {errors.publisherId && (
                                    <p className="mt-1 text-sm text-red-500">{errors.publisherId}</p>
                                )}
                            </div>

                            {/* Ngày xuất bản */}
                            <div>
                                <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
                                    Ngày xuất bản <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex">
                                    <div className="relative flex items-center flex-grow">
                                        <CalendarIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="date"
                                            name="publishDate"
                                            id="publishDate"
                                            value={formData.publishDate}
                                            onChange={handleChange}
                                            className={`pl-10 block w-full rounded-md ${errors.publishDate ? 'border-red-300' : 'border-gray-300'
                                                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                        />
                                    </div>
                                </div>
                                {errors.publishDate && (
                                    <p className="mt-1 text-sm text-red-500">{errors.publishDate}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="p-6 space-y-6">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Thông tin chi tiết
                        </h2>

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
                                        } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                    placeholder="Nhập mô tả chi tiết về sách"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Upload hình bìa */}
                        <div>
                            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                                Hình ảnh bìa
                            </label>
                            <div className="flex flex-col space-y-2">
                                <div className={`border-2 border-dashed rounded-lg p-6 ${errors.coverImage ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-500'
                                    } flex flex-col items-center justify-center transition-all`}>
                                    <input
                                        type="file"
                                        name="coverImage"
                                        id="coverImage"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={handleImageChange}
                                        className="sr-only"
                                    />
                                    <label htmlFor="coverImage" className="w-full h-full cursor-pointer flex flex-col items-center">
                                        {imagePreview ? (
                                            <div className="relative w-32 h-44">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Book cover preview"
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="text-sm text-gray-500 text-center mt-2">
                                                    Click để tải lên hình bìa sách<br />
                                                    <span className="text-xs">JPG, PNG, GIF hoặc WEBP (tối đa 5MB)</span>
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {errors.coverImage && (
                                    <p className="text-sm text-red-500">{errors.coverImage}</p>
                                )}
                                {imagePreview && (
                                    <button
                                        type="button"
                                        className="text-sm text-red-600 hover:text-red-800 self-start"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setFormData(prev => ({ ...prev, coverImage: null }));
                                        }}
                                    >
                                        Xóa hình ảnh
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Two columns layout for desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Số trang */}
                            <div>
                                <label htmlFor="pages" className="block text-sm font-medium text-gray-700">
                                    Số trang
                                </label>
                                <div className="mt-1 flex">
                                    <div className="relative flex items-center flex-grow">
                                        <input
                                            type="number"
                                            name="pages"
                                            id="pages"
                                            min="1"
                                            value={formData.pages}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="Nhập số trang"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Ngôn ngữ */}
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                                    Ngôn ngữ
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="language"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="Vietnamese">Tiếng Việt</option>
                                        <option value="English">Tiếng Anh</option>
                                        <option value="French">Tiếng Pháp</option>
                                        <option value="Chinese">Tiếng Trung</option>
                                        <option value="Japanese">Tiếng Nhật</option>
                                        <option value="Korean">Tiếng Hàn</option>
                                        <option value="Other">Khác</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="p-6 space-y-6">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Thông tin lưu trữ
                        </h2>

                        {/* Two columns layout for desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Số lượng */}
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                    Số lượng <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex">
                                    <div className="relative flex items-center flex-grow">
                                        <CalculatorIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            name="quantity"
                                            id="quantity"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            className={`pl-10 block w-full rounded-md ${errors.quantity ? 'border-red-300' : 'border-gray-300'
                                                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                            placeholder="Nhập số lượng sách"
                                        />
                                    </div>
                                </div>
                                {errors.quantity && (
                                    <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
                                )}
                            </div>

                            {/* Vị trí */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                    Vị trí <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex">
                                    <div className="relative flex items-center flex-grow">
                                        <MapPinIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="location"
                                            id="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className={`pl-10 block w-full rounded-md ${errors.location ? 'border-red-300' : 'border-gray-300'
                                                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                            placeholder="Ví dụ: Kệ A-12, Tầng 2"
                                        />
                                    </div>
                                </div>
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6">
                    <Link
                        href="/admin/library/books"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                                <span>Thêm sách</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
