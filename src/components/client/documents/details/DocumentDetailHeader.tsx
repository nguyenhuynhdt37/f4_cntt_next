"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Calendar, User, BookOpen, Clock } from "lucide-react";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface DocumentDetailHeaderProps {
  document: {
    id: string;
    title: string;
    description: string;
    category: string;
    downloadCount: number;
    uploadDate: string;
    fileSize: string;
    fileType: string;
    author: string;
    pageCount: number;
    estimatedReadTime: string;
    color: string;
    pdfUrl?: string;
  };
}

export default function DocumentDetailHeader({ document }: DocumentDetailHeaderProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    // Kiểm tra trong localStorage xem tài liệu này đã được yêu thích chưa
    const favoriteDocuments = JSON.parse(localStorage.getItem('favoriteDocuments') || '[]');
    setIsFavorite(favoriteDocuments.includes(document.id));
  }, [document.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(date);
  };

  const toggleFavorite = () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    
    // Lưu vào localStorage
    const favoriteDocuments = JSON.parse(localStorage.getItem('favoriteDocuments') || '[]');
    
    if (newValue) {
      // Nếu thêm vào yêu thích
      if (!favoriteDocuments.includes(document.id)) {
        favoriteDocuments.push(document.id);
      }
    } else {
      // Nếu loại bỏ khỏi yêu thích
      const index = favoriteDocuments.indexOf(document.id);
      if (index !== -1) {
        favoriteDocuments.splice(index, 1);
      }
    }
    
    localStorage.setItem('favoriteDocuments', JSON.stringify(favoriteDocuments));
  };
    const downloadDocument = async () => {
    setIsDownloading(true);
    try {
      // Giả lập API gọi để tăng lượt tải xuống
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Giả lập tải xuống PDF (thực tế sẽ thực hiện API call)
      setIsDownloading(false);
      
      // Thông báo thành công
      alert(`Đã tải xuống tài liệu: ${document.title}`);
    } catch (err) {
      console.error("Failed to download:", err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <div className={`h-3 w-full ${document.color} rounded-t-xl absolute top-0 left-0 right-0`}></div>
      
      <div className="flex flex-col md:flex-row gap-6 relative pt-4">
        <div className={`h-40 w-32 md:w-40 ${document.color} bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700`}>
          <FileText size={60} className="text-gray-400" />
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge className={`${document.color} bg-opacity-90 text-white`}>
              {document.category}
            </Badge>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Ngày tải lên: {formatDate(document.uploadDate)}</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            {document.title}
          </h1>
          
          <p className="text-gray-600 text-sm dark:text-gray-300 mb-4">
            {document.description}
          </p>
          
          <div className="text-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 mb-6 mt-10">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <User className="h-4 w-4 mr-2" />
              <span>{document.author}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <FileText className="h-4 w-4 mr-2" />
              <span>{document.fileType.toUpperCase()} ({document.fileSize})</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>{document.pageCount} trang</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4 mr-2" />
              <span>{document.estimatedReadTime}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">            
            <Button 
              className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white"
              size="lg"
              onClick={downloadDocument}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span> Đang tải...</>
              ) : (
                <><Download className="mr-2 h-5 w-5" /> Tải xuống</>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={toggleFavorite}
              className="border-gray-300 cursor-pointer dark:border-gray-600"
            >
              {isFavorite ? (
                <>
                  <FaHeart className="mr-2 h-5 w-5 text-red-500" /> Đã thêm vào yêu thích
                </>
              ) : (
                <>
                  <FaRegHeart className="mr-2 h-5 w-5" /> Thêm vào yêu thích
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
