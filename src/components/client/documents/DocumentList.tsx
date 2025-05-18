'use client';

import Link from 'next/link';
import { FileIcon, CalendarIcon, DownloadIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';

interface Document {
    id: string;
    title: string;
    description: string;
    category: string;
    downloadCount: number;
    uploadDate: string;
    fileSize: string;
    fileType: string;
    author: string;
    thumbnailUrl: string;
    color: string;
    isPremium?: boolean;
    score?: number;
    averageRating?: number;
    totalRatings?: number;
}

interface DocumentListProps {
    documents: Document[];
}

export default function DocumentList({ documents }: DocumentListProps) {
    return (
        <div className="space-y-4">
            {documents.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <FileIcon className="w-12 h-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-200">Không tìm thấy tài liệu</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Không có tài liệu nào khớp với tiêu chí tìm kiếm của bạn.</p>
                </div>
            ) : (
                documents.map((document) => (
                    <Link href={`/documents/details/${document.id}`} key={document.id} className="block">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md transition-all hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500">
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-16 h-16 ${document.color} rounded-lg flex items-center justify-center shadow-lg`}>
                                    <FileIcon className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{document.title}</h3>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300 line-clamp-2 text-sm">{document.description}</p>
                                    <div className="mt-2 flex items-center flex-wrap gap-2">                                        <Badge variant="outline" className="text-sm font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                        {document.category}
                                    </Badge>
                                        {document.isPremium && document.score && document.score > 0 ? (
                                            <Badge className="text-xs font-medium bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                                                {document.score} điểm
                                            </Badge>
                                        ) : (
                                            <Badge className="text-xs font-medium bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800">
                                                Miễn phí
                                            </Badge>
                                        )}
                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                            {document.uploadDate}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {document.fileSize} • {document.fileType.toUpperCase()}
                                        </span>                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                            <DownloadIcon className="h-3.5 w-3.5 mr-1" />
                                            {document.downloadCount.toLocaleString()}
                                        </span>
                                        {document.averageRating !== undefined && (
                                            <span className="flex items-center">
                                                <StarRating rating={document.averageRating} size="sm" showText totalRatings={document.totalRatings} />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}
