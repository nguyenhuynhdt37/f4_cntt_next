'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    XCircleIcon,
    BookOpenIcon,
    UserIcon,
    BuildingLibraryIcon,
    InformationCircleIcon,
    PhotoIcon,
    BookmarkIcon,
    CalculatorIcon,
    IdentificationIcon,
    CalendarIcon,
    ExclamationCircleIcon,
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

interface BookFormData {
    id: number;
    title: string;
    description: string;
    authorId: number;
    publisherId: number;
    categoryId: number;
    publishDate: string;
    isbn: string;
    quantity: number;
    pageCount: number;
    language: string;
    location: string;
    coverImage: string | null;
    coverImageFile: File | null;
}

// Mocked data for select dropdowns
const mockCategories: Category[] = [
    { id: 1, name: 'Công nghệ thông tin' },
    { id: 2, name: 'Toán học' },
    { id: 3, name: 'Khoa học máy tính' },
    { id: 4, name: 'Vật lý' },
    { id: 5, name: 'Hóa học' },
];

const mockAuthors: Author[] = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Lê Văn C' },
    { id: 4, name: 'Phạm Thị D' },
];

const mockPublishers: Publisher[] = [
    { id: 1, name: 'NXB Giáo dục' },
    { id: 2, name: 'NXB Khoa học kỹ thuật' },
    { id: 3, name: 'NXB Đại học Quốc gia' },
    { id: 4, name: 'NXB Trẻ' },
];

// Mock book data for editing
const mockBookData: BookFormData = {
    id: 1,
    title: 'Lập trình với Python',
    description: 'Cuốn sách giới thiệu về ngôn ngữ lập trình Python từ cơ bản đến nâng cao, với nhiều ví dụ thực tế và bài tập thực hành.',
    authorId: 1,
    publisherId: 1,
    categoryId: 1,
    publishDate: '2023-05-15',
    isbn: '9781234567897',
    quantity: 5,
    pageCount: 450,
    language: 'Tiếng Việt',
    location: 'Kệ A2-15',
    coverImage: '/images/book-covers/python-programming.jpg',
    coverImageFile: null
};

interface EditBookFormProps {
    bookId?: number;
}

const EditBookForm: React.FC<EditBookFormProps> = ({ bookId }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<BookFormData>({
        id: 0,
        title: '',
        description: '',
        authorId: 0,
        publisherId: 0,
        categoryId: 0,
        publishDate: '',
        isbn: '',
        quantity: 1,
        pageCount: 0,
        language: 'Tiếng Việt',
        location: '',
        coverImage: null,
        coverImageFile: null,
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);

    // In a real application, this would fetch the book data from an API
    useEffect(() => {
        const fetchBookData = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                // In a real app, we'd get the book by ID
                setFormData(mockBookData);
                setPreviewImage(mockBookData.coverImage);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching book data:', error);
                setLoading(false);
            }
        };

        const fetchSelectData = async () => {
            // In a real app, these would be API calls
            setCategories(mockCategories);
            setAuthors(mockAuthors);
            setPublishers(mockPublishers);
        };

        fetchBookData();
        fetchSelectData();
    }, [bookId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // For number inputs, convert to number
        if (name === 'quantity' || name === 'pageCount') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear the error for this field if it exists
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Check file type
            if (!file.type.match('image.*')) {
                setErrors(prev => ({
                    ...prev,
                    coverImage: 'Chỉ chấp nhận file hình ảnh'
                }));
                return;
            }

            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    coverImage: 'Kích thước file không được vượt quá 5MB'
                }));
                return;
            }

            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Update form data
            setFormData(prev => ({
                ...prev,
                coverImageFile: file
            }));

            // Clear any previous error
            if (errors.coverImage) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.coverImage;
                    return newErrors;
                });
            }
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        setFormData(prev => ({
            ...prev,
            coverImage: null,
            coverImageFile: null
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề sách là bắt buộc';
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

        if (!formData.isbn.trim()) {
            newErrors.isbn = 'ISBN là bắt buộc';
        } else if (!/^(?:\d{10}|\d{13})$|^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(formData.isbn.replace(/-/g, ''))) {
            newErrors.isbn = 'ISBN không hợp lệ (phải có 10 hoặc 13 chữ số)';
        }

        if (formData.quantity < 0) {
            newErrors.quantity = 'Số lượng không được âm';
        }

        if (!formData.publishDate) {
            newErrors.publishDate = 'Ngày xuất bản là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            // In a real app, this would be an API call to update the book
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success or redirect
            router.push('/admin/library/books');
        } catch (error) {
            console.error('Error updating book:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <Link href="/admin/library/books" className="mr-4 text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa sách</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <section>
                        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Thông tin cơ bản
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề sách <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        placeholder="Nhập tiêu đề sách"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                                    ISBN <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        name="isbn"
                                        id="isbn"
                                        value={formData.isbn}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-md border ${errors.isbn ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        placeholder="Ví dụ: 978-3-16-148410-0"
                                    />
                                    {errors.isbn && (
                                        <p className="mt-1 text-xs text-red-600">{errors.isbn}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tác giả <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    <select
                                        id="authorId"
                                        name="authorId"
                                        value={formData.authorId}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-md border ${errors.authorId ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    >
                                        <option value="">Chọn tác giả</option>
                                        {authors.map(author => (
                                            <option key={author.id} value={author.id}>
                                                {author.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.authorId && (
                                        <p className="mt-1 text-xs text-red-600">{errors.authorId}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="publisherId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nhà xuất bản <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    <select
                                        id="publisherId"
                                        name="publisherId"
                                        value={formData.publisherId}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-md border ${errors.publisherId ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    >
                                        <option value="">Chọn nhà xuất bản</option>
                                        {publishers.map(publisher => (
                                            <option key={publisher.id} value={publisher.id}>
                                                {publisher.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.publisherId && (
                                        <p className="mt-1 text-xs text-red-600">{errors.publisherId}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-md border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && (
                                        <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày xuất bản <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    <input
                                        type="date"
                                        name="publishDate"
                                        id="publishDate"
                                        value={formData.publishDate}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-md border ${errors.publishDate ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    />
                                    {errors.publishDate && (
                                        <p className="mt-1 text-xs text-red-600">{errors.publishDate}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                    Số lượng <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    <input
                                        type="number"
                                        name="quantity"
                                        id="quantity"
                                        min="0"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-md border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    />
                                    {errors.quantity && (
                                        <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngôn ngữ
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        name="language"
                                        id="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Ví dụ: Tiếng Việt, Tiếng Anh"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="pageCount" className="block text-sm font-medium text-gray-700 mb-1">
                                    Số trang
                                </label>
                                <div>
                                    <input
                                        type="number"
                                        name="pageCount"
                                        id="pageCount"
                                        min="0"
                                        value={formData.pageCount}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Vị trí trong thư viện
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        name="location"
                                        id="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Ví dụ: Kệ A2-15"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Book Description */}
                    <section>
                        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <BookOpenIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Mô tả sách
                        </h2>
                        <div>
                            <textarea
                                name="description"
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Nhập mô tả về nội dung sách"
                            />
                        </div>
                    </section>

                    {/* Book Cover Image */}
                    <section>
                        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <PhotoIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Ảnh bìa sách
                        </h2>

                        <div className="flex items-start space-x-6">
                            <div className="w-40 h-56 rounded-md border border-gray-300 overflow-hidden relative">
                                {previewImage ? (
                                    <>
                                        <Image
                                            src={previewImage}
                                            alt="Book cover preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                                        >
                                            <XCircleIcon className="h-5 w-5 text-gray-600" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                        <PhotoIcon className="h-12 w-12 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tải lên ảnh bìa mới
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-2 text-center">
                                        <div className="mx-auto h-12 w-12 text-gray-400">
                                            <PhotoIcon className="h-12 w-12 text-gray-300" />
                                        </div>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="coverImageFile"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                            >
                                                <span>Tải lên ảnh</span>
                                                <input
                                                    id="coverImageFile"
                                                    name="coverImageFile"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1">hoặc kéo thả vào đây</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF tối đa 5MB
                                        </p>
                                    </div>
                                </div>
                                {errors.coverImage && (
                                    <p className="mt-1 text-xs text-red-600">{errors.coverImage}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
                        <Link
                            href="/admin/library/books"
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Huỷ
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookForm;
