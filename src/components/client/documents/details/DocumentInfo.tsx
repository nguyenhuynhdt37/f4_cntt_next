"use client";

import { CalendarIcon, UserIcon, TagIcon, DownloadIcon, BookOpenIcon } from "lucide-react";
import { Button } from "../../../ui/button";

interface DocumentInfoProps {
  document: {
    id: string;
    title: string;
    description: string;
    category: string;
    tags?: string[];
    downloadCount: number;
    uploadDate: string;
    fileSize: string;
    fileType: string;
    author: string;
    pageCount: number;
    language?: string;
    publisher?: string;
    publicationDate?: string;
    isbn?: string;
  };
}

export default function DocumentInfo({ document }: DocumentInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(date);
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
        Thông tin chi tiết
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-start group">
            <UserIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mt-0.5 mr-3 transition-colors" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tác giả</p>
              <p className="text-gray-900 dark:text-white font-medium">{document.author}</p>
            </div>
          </div>
          
          {document.publisher && (
            <div className="flex items-start group">
              <BookOpenIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mt-0.5 mr-3 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nhà xuất bản</p>
                <p className="text-gray-900 dark:text-white font-medium">{document.publisher}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start group">
            <CalendarIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mt-0.5 mr-3 transition-colors" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày tải lên</p>
              <p className="text-gray-900 dark:text-white font-medium">{formatDate(document.uploadDate)}</p>
            </div>
          </div>
          
          {document.publicationDate && (
            <div className="flex items-start group">
              <CalendarIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mt-0.5 mr-3 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày xuất bản</p>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(document.publicationDate)}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start group">
            <TagIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mt-0.5 mr-3 transition-colors" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Danh mục</p>
              <p className="text-gray-900 dark:text-white font-medium">{document.category}</p>
            </div>
          </div>
          
          <div className="flex items-start group">
            <BookOpenIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mt-0.5 mr-3 transition-colors" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số trang</p>
              <p className="text-gray-900 dark:text-white font-medium">{document.pageCount} trang</p>
            </div>
          </div>
          
          <div className="flex items-start group">
            <DownloadIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mt-0.5 mr-3 transition-colors" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Lượt tải</p>
              <p className="text-gray-900 dark:text-white font-medium">{document.downloadCount.toLocaleString("vi-VN")}</p>
            </div>
          </div>          
          {document.language && (
            <div className="flex items-start group">
              <BookOpenIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mt-0.5 mr-3 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngôn ngữ</p>
                <p className="text-gray-900 dark:text-white font-medium">{document.language}</p>
              </div>
            </div>
          )}

          {document.isbn && (
            <div className="flex items-start group">
              <BookOpenIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mt-0.5 mr-3 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mã ISBN</p>
                <p className="text-gray-900 dark:text-white font-medium">{document.isbn}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {document.tags && document.tags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
            <TagIcon className="h-4 w-4 text-indigo-500 mr-2" />Từ khóa
          </p>
          <div className="flex flex-wrap gap-2">
            {document.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-block bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/40 dark:text-indigo-400 rounded-full px-3 py-1 text-sm transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Liên kết nhanh</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <DownloadIcon className="h-3 w-3 mr-1" /> Tải xuống
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <BookOpenIcon className="h-3 w-3 mr-1" /> Tài liệu tương tự
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <TagIcon className="h-3 w-3 mr-1" /> Tìm theo danh mục 
          </Button>
        </div>
      </div>
    </div>
  );
}
