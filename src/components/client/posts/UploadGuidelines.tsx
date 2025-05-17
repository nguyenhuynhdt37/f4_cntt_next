'use client';

import React from 'react';
import {
    DocumentTextIcon,
    ShieldCheckIcon,
    DocumentDuplicateIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const UploadGuidelines: React.FC = () => {
    const supportedFormats = [
        { name: 'PDF', description: '.pdf - Định dạng phổ biến nhất cho tài liệu' },
        { name: 'Word', description: '.doc, .docx - Tài liệu Microsoft Word' },
        { name: 'Excel', description: '.xls, .xlsx - Bảng tính Microsoft Excel' },
        { name: 'PowerPoint', description: '.ppt, .pptx - Bài thuyết trình Microsoft PowerPoint' },
        { name: 'Text', description: '.txt - Văn bản thuần' },
        { name: 'Rich Text', description: '.rtf - Định dạng văn bản phong phú' },
        { name: 'Nén', description: '.zip, .rar - Tệp nén chứa nhiều tài liệu' },
        { name: 'Hình ảnh', description: '.jpg, .png - Hình ảnh, sơ đồ, bản vẽ' },
    ];

    const guidelines = [
        {
            title: 'Tài liệu chất lượng',
            description: 'Đảm bảo tài liệu của bạn có thông tin chính xác, dễ đọc và hữu ích cho người học.',
            icon: <CheckCircleIcon className="h-8 w-8 text-emerald-500" />,
        },
        {
            title: 'Tôn trọng bản quyền',
            description: 'Chỉ đăng tải những tài liệu mà bạn là tác giả hoặc có quyền chia sẻ công khai.',
            icon: <ShieldCheckIcon className="h-8 w-8 text-blue-500" />,
        },
        {
            title: 'Xét duyệt',
            description: 'Tất cả tài liệu sẽ được quản trị viên xét duyệt trước khi xuất bản trên hệ thống.',
            icon: <ClockIcon className="h-8 w-8 text-orange-500" />,
        },
        {
            title: 'Hoàn thiện thông tin',
            description: 'Cung cấp đầy đủ thông tin về tài liệu để giúp người dùng dễ dàng tìm kiếm và sử dụng.',
            icon: <DocumentDuplicateIcon className="h-8 w-8 text-purple-500" />,
        },
    ];

    const prohibited = [
        'Tài liệu vi phạm bản quyền hoặc sở hữu trí tuệ',
        'Nội dung khiêu dâm, bạo lực hoặc phân biệt đối xử',
        'Malware, virus hoặc mã độc hại',
        'Thông tin cá nhân của người khác',
        'Tài liệu đã xuất bản trên trang web khác mà không có sự cho phép',
    ];

    return (
        <div className="my-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Hướng dẫn đăng tải tài liệu</h2>
                    <p className="text-gray-600 mb-6">
                        Chúng tôi khuyến khích việc chia sẻ kiến thức và tài liệu hữu ích cho cộng đồng.
                        Hãy tuân thủ các hướng dẫn sau để tài liệu của bạn được duyệt nhanh chóng.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {guidelines.map((guideline, index) => (
                            <div key={index} className="flex">
                                <div className="flex-shrink-0">
                                    {guideline.icon}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{guideline.title}</h3>
                                    <p className="mt-1 text-sm text-gray-600">{guideline.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <DocumentTextIcon className="h-6 w-6 text-blue-500 mr-2" />
                            Định dạng tệp được hỗ trợ
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {supportedFormats.map((format, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-3">
                                    <h4 className="font-medium text-gray-900">{format.name}</h4>
                                    <p className="text-sm text-gray-600">{format.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
                        Nội dung không được phép
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-red-700">
                        {prohibited.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quy trình sau khi đăng tải</h3>

                        <ol className="relative border-l border-gray-200 pl-6 space-y-6 py-2">
                            <li className="mb-6">
                                <div className="absolute -left-3 bg-blue-100 rounded-full p-1">
                                    <span className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm">1</span>
                                </div>
                                <h4 className="text-lg font-medium text-gray-900">Đăng tải tài liệu</h4>
                                <p className="text-gray-600 mt-1">Điền đầy đủ thông tin và tải tệp lên hệ thống.</p>
                            </li>
                            <li className="mb-6">
                                <div className="absolute -left-3 bg-orange-100 rounded-full p-1">
                                    <span className="h-5 w-5 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm">2</span>
                                </div>
                                <h4 className="text-lg font-medium text-gray-900">Xét duyệt</h4>
                                <p className="text-gray-600 mt-1">Quản trị viên sẽ xem xét nội dung của tài liệu (thường mất 1-2 ngày làm việc).</p>
                            </li>
                            <li className="mb-6">
                                <div className="absolute -left-3 bg-green-100 rounded-full p-1">
                                    <span className="h-5 w-5 flex items-center justify-center rounded-full bg-green-600 text-white text-sm">3</span>
                                </div>
                                <h4 className="text-lg font-medium text-gray-900">Xuất bản</h4>
                                <p className="text-gray-600 mt-1">Nếu được duyệt, tài liệu sẽ xuất hiện trên hệ thống và có thể tìm kiếm được.</p>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadGuidelines;
