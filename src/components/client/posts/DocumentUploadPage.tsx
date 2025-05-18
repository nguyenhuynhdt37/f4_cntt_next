'use client';

import React, { useState } from 'react';
import DocumentUploadForm from './DocumentUploadForm';
import UploadGuidelines from './UploadGuidelines';
import { BookOpenIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const DocumentUploadPage: React.FC = () => {
    const [showGuidelines, setShowGuidelines] = useState(false);

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl overflow-hidden shadow-xl mb-8">
                    <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
                        <div className="md:flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                Chia sẻ kiến thức, <br className="hidden md:block" />
                                Tạo giá trị cùng cộng đồng
                            </h1>
                            <p className="text-sm mt-4 text-blue-100 max-w-lg">
                                Mỗi tài liệu bạn chia sẻ có thể giúp đỡ hàng nghìn sinh viên và người học trong hành trình học tập của họ.
                            </p>
                            <button
                                onClick={() => setShowGuidelines(!showGuidelines)}
                                className="text-sm mt-6 inline-flex items-center px-5 py-2.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                            >
                                <InformationCircleIcon className="h-5 w-5 mr-2" />
                                {showGuidelines ? "Ẩn hướng dẫn" : "Xem hướng dẫn đăng tải"}
                            </button>
                        </div>
                        <div className="hidden md:block md:flex-shrink-0">
                            <BookOpenIcon className="h-40 w-40 text-blue-300/50" />
                        </div>
                    </div>
                </div>

                {/* Guidelines (toggle visibility) */}
                {showGuidelines && <UploadGuidelines />}

                {/* Upload form */}
                <DocumentUploadForm />
            </div>
        </div>
    );
};

export default DocumentUploadPage;
