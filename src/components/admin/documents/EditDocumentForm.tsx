'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    DocumentTextIcon,
    XCircleIcon,
    ArrowLeftIcon,
    PaperClipIcon,
    DocumentArrowUpIcon,
    DocumentMagnifyingGlassIcon,
    BookOpenIcon,
    InformationCircleIcon,
    BuildingLibraryIcon,
    DocumentDuplicateIcon,
    CheckCircleIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { getDocumentById, updateDocument } from '@/api/axios/document';
import { getAuthorById, getListAuthor } from '@/api/axios/authors';
import { getListPublisher } from '@/api/axios/publishers';
import { getListCategory } from '@/api/axios/categories';

interface EditDocumentProps {
    id: string;
}

export default function EditDocumentForm({ id }: EditDocumentProps) {
    const router = useRouter();
    const [authors, setAuthors] = useState<any[]>([]);
    const [publishers, setPublishers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        authorId: '',
        publisherId: '',
        categoryId: '',
        status: 0, // 0=Pending, 1=Approved, 2=Rejected
        isPremium: false,
        file: null as File | null,
        fileUrl: '',
        conversionStatus: '',
        totalPages: 0,
        previewPageLimit: 0
    });
    // Fetch document and reference data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [documentRes, authorsRes, publishersRes, categoriesRes] = await Promise.all([
                    getDocumentById(id),
                    getListAuthor({}),
                    getListPublisher({}),
                    getListCategory({})
                ]);

                const authorItems = authorsRes?.items || [];
                const publisherItems = publishersRes?.items || [];
                const categoryItems = categoriesRes?.items || [];

                setAuthors(authorItems);
                setPublishers(publisherItems);
                setCategories(categoryItems);

                console.log("Document data:", documentRes);

                // The backend now returns Author, Category, Publisher directly
                // as well as their IDs as AuthorId, CategoryId, PublisherId
                setFormData({
                    title: documentRes.title || '',
                    description: documentRes.description || '',
                    authorId: documentRes.authorId?.toString() || '',
                    publisherId: documentRes.publisherId?.toString() || '',
                    categoryId: documentRes.categoryId?.toString() || '',
                    status: documentRes.status || 0,
                    isPremium: documentRes.isPremium || false,
                    file: null,
                    fileUrl: documentRes.fileUrl || '',
                    conversionStatus: documentRes.conversionStatus || '',
                    totalPages: documentRes.totalPages || 0,
                    previewPageLimit: documentRes.previewPageLimit || 0
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Không thể tải thông tin tài liệu. Vui lòng thử lại sau.');
                router.push('/admin/documents');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox for boolean fields
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            if (name === "isApproved") {
                setFormData(prev => ({
                    ...prev,
                    status: checked ? 1 : 0
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                }));
            }
        }
        // Handle file upload
        else if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            const file = files ? files[0] : null;
            setFormData(prev => ({
                ...prev,
                file
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

        if (!formData.title.trim()) {
            newErrors.title = 'Vui lòng nhập tiêu đề tài liệu';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Vui lòng nhập mô tả tài liệu';
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

        if (formData.file) {
            const fileSize = formData.file.size / 1024 / 1024; // size in MB
            const fileType = formData.file.type;
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (fileSize > 50) {
                newErrors.file = 'File quá lớn. Kích thước tối đa là 50MB.';
            }

            if (!validTypes.includes(fileType)) {
                newErrors.file = 'Định dạng file không được hỗ trợ. Vui lòng tải lên file PDF hoặc Word.';
            }
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
            await updateDocument(id, {
                id: parseInt(id),
                title: formData.title,
                description: formData.description,
                authorId: parseInt(formData.authorId),
                publisherId: parseInt(formData.publisherId),
                categoryId: parseInt(formData.categoryId),
                isPremium: formData.isPremium,
                file: formData.file || undefined
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
                            Cập nhật tài liệu thành công!
                        </p>
                    </div>
                </div>
            `;
            document.body.appendChild(successMessage);

            setTimeout(() => {
                document.body.removeChild(successMessage);
                router.push('/admin/documents');
            }, 2000);

        } catch (error: any) {
            console.error('Lỗi khi cập nhật tài liệu:', error);

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
                    form: apiMessage || 'Đã xảy ra lỗi khi cập nhật tài liệu. Vui lòng thử lại.',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFileIcon = () => {
        if (formData.file) {
            const fileType = formData.file.type;

            if (fileType === 'application/pdf') {
                return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
            } else if (fileType.includes('word')) {
                return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
            } else {
                return <DocumentDuplicateIcon className="h-8 w-8 text-gray-500" />;
            }
        }

        // Check the file extension from fileUrl
        if (formData.fileUrl) {
            if (formData.fileUrl.toLowerCase().endsWith('.pdf')) {
                return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
            } else if (formData.fileUrl.toLowerCase().match(/\.(doc|docx)$/)) {
                return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
            }
        }

        return <DocumentDuplicateIcon className="h-8 w-8 text-gray-500" />;
    };

    const getConversionStatusBadge = () => {
        const status = formData.conversionStatus?.toLowerCase() || '';

        switch (status) {
            case 'completed':
                return (
                    <div className="flex items-center gap-1 text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Đã hoàn thành</span>
                    </div>
                );
            case 'processing':
                return (
                    <div className="flex items-center gap-1 text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-medium">Đang xử lý</span>
                    </div>
                );
            case 'pending':
                return (
                    <div className="flex items-center gap-1 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                        <span className="text-sm">⏱️</span>
                        <span className="text-sm font-medium">Đang chờ</span>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center gap-1 text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                        <XCircleIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Thất bại</span>
                    </div>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
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
                                <DocumentTextIcon className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa tài liệu</h1>
                        </div>
                        <p className="text-gray-600 pl-10">{formData.title}</p>
                    </div>
                    <Link
                        href="/admin/documents"
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
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tài liệu
                            </label>
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300 hover:border-blue-400 transition-colors">
                                <div className="space-y-3 text-center">
                                    {formData.file ? (
                                        <div className="mt-4 flex items-center justify-center space-x-2 bg-blue-50 p-3 rounded-md border border-blue-100">
                                            {getFileIcon()}
                                            <div className="flex flex-col items-start">
                                                <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, file: null })}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <XCircleIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : formData.fileUrl ? (
                                        <div className="mb-2">
                                            <div className="flex items-center justify-center space-x-2 bg-blue-50 p-3 rounded-md border border-blue-100">
                                                {getFileIcon()}
                                                <div className="flex flex-col items-start">
                                                    <p className="text-sm font-medium text-gray-900">Tài liệu hiện tại</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-xs">
                                                        {formData.fileUrl.split('/').pop()}
                                                    </p>
                                                </div>
                                                <a
                                                    href={formData.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="flex flex-col items-center">
                                        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="text-sm text-gray-600 mt-1">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>{formData.fileUrl ? 'Thay thế tài liệu' : 'Tải lên tệp'}</span>
                                                <input
                                                    id="file-upload"
                                                    name="file"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleChange}
                                                    accept=".pdf,.doc,.docx"
                                                />
                                            </label>
                                            {' '}hoặc kéo thả vào đây
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PDF, DOC, DOCX tối đa 50MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {errors.file && (
                                <p className="mt-1 text-red-500 text-sm flex items-center">
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    {errors.file}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề<span className="text-red-500">*</span>
                                </label>
                                <div className={`flex rounded-md shadow-sm border ${errors.title ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}>
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <DocumentTextIcon className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Nhập tiêu đề tài liệu"
                                    />
                                </div>
                                {errors.title && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Category field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh mục<span className="text-red-500">*</span>
                                </label>
                                <div className={`flex rounded-md shadow-sm border ${errors.categoryId ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}>
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <BookOpenIcon className="h-5 w-5" />
                                    </span>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map((category: any) => (
                                            <option key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.categoryId && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.categoryId}
                                    </p>
                                )}
                            </div>

                            {/* Author field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tác giả<span className="text-red-500">*</span>
                                </label>
                                <div className={`flex rounded-md shadow-sm border ${errors.authorId ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}>
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                                    </span>
                                    <select
                                        name="authorId"
                                        value={formData.authorId}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                    >
                                        <option value="">-- Chọn tác giả --</option>
                                        {authors.map((author: any) => (
                                            <option key={author.id} value={author.id.toString()}>
                                                {author.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.authorId && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.authorId}
                                    </p>
                                )}
                            </div>

                            {/* Publisher field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nhà xuất bản<span className="text-red-500">*</span>
                                </label>
                                <div className={`flex rounded-md shadow-sm border ${errors.publisherId ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}>
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <BuildingLibraryIcon className="h-5 w-5" />
                                    </span>
                                    <select
                                        name="publisherId"
                                        value={formData.publisherId}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                    >
                                        <option value="">-- Chọn nhà xuất bản --</option>
                                        {publishers.map((publisher: any) => (
                                            <option key={publisher.id} value={publisher.id.toString()}>
                                                {publisher.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.publisherId && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.publisherId}
                                    </p>
                                )}
                            </div>

                            {/* Description field - spans 2 columns */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả<span className="text-red-500">*</span>
                                </label>
                                <div className={`flex rounded-md shadow-sm border ${errors.description ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}>
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <InformationCircleIcon className="h-5 w-5" />
                                    </span>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Nhập mô tả chi tiết về tài liệu"
                                    />
                                </div>
                                {errors.description && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Document options */}
                        <div className="border-t border-gray-200 pt-5">
                            <div className="flex flex-col sm:flex-row sm:gap-6">
                                {/* Approved Status */}
                                <div className="mb-3 sm:mb-0">
                                    <div className="flex items-center">
                                        <input
                                            id="isApproved"
                                            name="isApproved"
                                            type="checkbox"
                                            checked={formData.status === 1}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isApproved" className="ml-2 block text-sm text-gray-700">
                                            Phê duyệt
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Tài liệu sẽ được hiển thị công khai khi được phê duyệt
                                    </p>
                                </div>

                                {/* Premium Status */}
                                <div>
                                    <div className="flex items-center">
                                        <input
                                            id="isPremium"
                                            name="isPremium"
                                            type="checkbox"
                                            checked={formData.isPremium}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-700">
                                            Tài liệu premium
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Người dùng cần có gói Premium để tải xuống tài liệu này
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="flex justify-end">
                            <Link
                                href="/admin/documents"
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
                                    'Cập nhật tài liệu'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
