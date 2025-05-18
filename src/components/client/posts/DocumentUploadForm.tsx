'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    DocumentArrowUpIcon,
    DocumentTextIcon,
    BookOpenIcon,
    UserIcon,
    BuildingLibraryIcon,
    InformationCircleIcon,
    PaperClipIcon,
    XMarkIcon,
    CheckCircleIcon,
    CurrencyDollarIcon, // Add new icon
} from '@heroicons/react/24/outline';
import { IDocumentUpload } from '@/api/axios/document';

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


const DocumentUploadForm: React.FC = () => {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        authorId: string;
        publisherId: string;
        categoryId: string;
        file: File | null;
        isPremium: boolean;
        score: number; // Add score field
    }>({
        title: '',
        description: '',
        authorId: '',
        publisherId: '',
        categoryId: '',
        file: null,
        isPremium: false,
        score: 0, // Default to 0 (free document)
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

        // Handle checkbox
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));

            // If isPremium is being toggled and the document becomes free (not premium),
            // reset score to 0 (free)
            if (name === 'isPremium' && !checked) {
                setFormData(prev => ({
                    ...prev,
                    score: 0
                }));
            }
        } else if (name === 'score') {
            // Handle score (ensure it's a number)
            const numberValue = parseInt(value, 10);
            setFormData(prev => ({
                ...prev,
                [name]: isNaN(numberValue) ? 0 : Math.max(0, numberValue)
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        // Check file size (max 20MB)
        if (file.size > 20 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                file: 'Kích thước tệp quá lớn. Tối đa 20MB được chấp nhận.'
            }));
            return;
        }

        // List of accepted file types
        const acceptedTypes = [
            'application/pdf', // PDF
            'application/msword', // DOC
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
            'application/vnd.ms-excel', // XLS
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
            'application/vnd.ms-powerpoint', // PPT
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
            'text/plain', // TXT
            'application/rtf', // RTF
            'application/zip', // ZIP
            'application/x-zip-compressed', // ZIP
            'application/x-rar-compressed', // RAR
            'application/vnd.rar', // RAR
            'image/jpeg', // JPEG/JPG
            'image/png', // PNG
        ];

        // Check file type
        if (!acceptedTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                file: 'Định dạng tệp không được hỗ trợ.'
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            file
        }));

        // Clear error
        if (errors.file) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.file;
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả không được để trống';
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

        if (!formData.file) {
            newErrors.file = 'Vui lòng tải lên tệp tài liệu';
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsUploading(true); try {
            // In a real implementation, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
            console.log('Document upload data:', {
                title: formData.title,
                description: formData.description,
                authorId: parseInt(formData.authorId),
                publisherId: parseInt(formData.publisherId),
                categoryId: parseInt(formData.categoryId),
                file: formData.file,
                isPremium: formData.isPremium,
                score: formData.score,
                isApproved: false // Default to pending approval
            });

            setIsSuccess(true);

            // Reset form after successful upload
            setTimeout(() => {
                setFormData({
                    title: '',
                    description: '',
                    authorId: '',
                    publisherId: '',
                    categoryId: '',
                    file: null,
                    isPremium: false,
                    score: 0, // Reset score to 0
                });
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error uploading document:', error);
            setErrors({
                general: 'Có lỗi xảy ra khi tải tài liệu. Vui lòng thử lại sau.'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return <DocumentTextIcon className="h-6 w-6 text-red-500" />;
            case 'doc':
            case 'docx':
                return <DocumentTextIcon className="h-6 w-6 text-blue-500" />;
            case 'xls':
            case 'xlsx':
                return <DocumentTextIcon className="h-6 w-6 text-green-500" />;
            case 'ppt':
            case 'pptx':
                return <DocumentTextIcon className="h-6 w-6 text-orange-500" />;
            default:
                return <DocumentTextIcon className="h-6 w-6 text-gray-500" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng tải tài liệu</h1>
                <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                    Chia sẻ kiến thức của bạn với cộng đồng. Tải lên tài liệu học tập, <br /> nghiên cứu để giúp đỡ những người khác trong hành trình học tập của họ.
                </p>
            </div>

            {isSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-700 mb-2">Tải lên thành công!</h2>
                    <p className="text-green-600 mb-4">
                        Tài liệu của bạn đã được tải lên và đang chờ xét duyệt. Chúng tôi sẽ thông báo cho bạn khi quá trình xét duyệt hoàn tất.
                    </p>
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Tải lên tài liệu khác
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <InformationCircleIcon className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{errors.general}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                        <div className="p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <DocumentArrowUpIcon className="h-6 w-6 mr-2" />
                                Thông tin tài liệu
                            </h2>

                            {/* Tiêu đề */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`text-sm w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="Nhập tiêu đề tài liệu"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className={`text-sm w-full px-3 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="Mô tả chi tiết về nội dung tài liệu"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Danh mục */}
                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center">
                                    <BookOpenIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className={`block w-full pl-3 pr-10 py-2 text-base border ${errors.categoryId ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
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
                                {errors.categoryId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                                )}
                            </div>

                            {/* Tác giả */}
                            <div>
                                <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tác giả <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center">
                                    <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <select
                                        id="authorId"
                                        name="authorId"
                                        value={formData.authorId}
                                        onChange={handleChange}
                                        className={`block w-full pl-3 pr-10 py-2 text-base border ${errors.authorId ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
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
                                {errors.authorId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.authorId}</p>
                                )}
                            </div>

                            {/* Nhà xuất bản */}
                            <div>
                                <label htmlFor="publisherId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nhà xuất bản <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center">
                                    <BuildingLibraryIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <select
                                        id="publisherId"
                                        name="publisherId"
                                        value={formData.publisherId}
                                        onChange={handleChange}
                                        className={`block w-full pl-3 pr-10 py-2 text-base border ${errors.publisherId ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
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
                                {errors.publisherId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.publisherId}</p>
                                )}
                            </div>

                            {/* Tùy chọn cao cấp */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isPremium"
                                    name="isPremium"
                                    checked={formData.isPremium}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-700">
                                    Đánh dấu là tài liệu cao cấp (chỉ thành viên premium mới xem được)
                                </label>
                            </div>

                            {/* Điểm số tài liệu */}
                            <div>
                                <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                                    Điểm số tài liệu <span className="text-xs text-gray-500">(0 = miễn phí)</span>
                                </label>
                                <div className="flex items-center">
                                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <input
                                        type="number"
                                        id="score"
                                        name="score"
                                        min="0"
                                        value={formData.score}
                                        onChange={handleChange}
                                        disabled={!formData.isPremium}
                                        className={`w-full px-3 py-2 border ${errors.score ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!formData.isPremium ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {formData.score === 0 && (
                                    <p className="mt-1 text-sm text-green-600">Tài liệu này sẽ được đọc miễn phí</p>
                                )}
                                {errors.score && (
                                    <p className="mt-1 text-sm text-red-600">{errors.score}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <PaperClipIcon className="h-6 w-6 mr-2" />
                                Tải lên tài liệu
                            </h2>

                            <div className={`border-2 border-dashed rounded-lg p-6 ${errors.file ? 'border-red-300 bg-red-50' : 'border-gray-300'} text-center`}>
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.zip,.rar,.jpg,.jpeg,.png"
                                />

                                {formData.file ? (
                                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                                        <div className="flex items-center">
                                            {getFileIcon(formData.file.name)}
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900 break-all">{formData.file.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="file" className="cursor-pointer">
                                        <div className="flex flex-col items-center justify-center py-6">
                                            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">
                                                Kéo thả tệp vào đây hoặc <span className="text-blue-600 font-medium">bấm để chọn tệp</span>
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Hỗ trợ: PDF, Word, Excel, PowerPoint, Text, ZIP, RAR (Tối đa 20MB)
                                            </p>
                                        </div>
                                    </label>
                                )}
                            </div>

                            {errors.file && (
                                <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                            )}

                            <div className="mt-3 text-xs text-gray-500">
                                <p className="flex items-center">
                                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                                    Tài liệu của bạn sẽ được xét duyệt trước khi xuất bản công khai.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="text-sm px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang tải lên...</span>
                                </div>
                            ) : (
                                <span>Tải lên tài liệu</span>
                            )}
                        </button>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-500">
                        Bằng việc đăng tải, bạn đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản sử dụng</a> của chúng tôi.
                    </div>
                </form>
            )}
        </div>
    );
};

export default DocumentUploadForm;
