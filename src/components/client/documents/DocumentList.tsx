"use client";

import { useState } from "react";
import { Download, FileText, Calendar, User } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

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
}

interface DocumentListProps {
  documents: Document[];
}

export default function DocumentList({ documents }: DocumentListProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(date);
  };
  
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <div className={`h-1.5 w-full ${doc.color}`}></div>
          <div className="p-5 flex flex-col md:flex-row gap-4">
            <div className={`relative h-24 w-24 flex-shrink-0 rounded-lg ${doc.color} bg-opacity-20 flex items-center justify-center`}>
              <FileText size={40} className={doc.color.replace('bg-gradient-to-r', 'text').replace('from-', '').replace('to-', '')} />
            </div>

            <div className="flex-grow flex flex-col">              <div className="flex items-center justify-between mb-2">
                <Badge className={`${doc.color} bg-opacity-90 text-white`}>
                  {doc.category}
                </Badge>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(doc.uploadDate)}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-1">{doc.title}</h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                {doc.description}
              </p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <User size={14} className="mr-1" />
                  {doc.author}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FileText size={14} className="mr-1" />
                  {doc.fileType.toUpperCase()} ({doc.fileSize})
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Download size={14} className="mr-1" />
                  {doc.downloadCount.toLocaleString("vi-VN")} lượt tải
                </div>
              </div>
                <div className="mt-auto flex items-center justify-between md:justify-end gap-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(doc.id);
                  }}
                  className="flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title={favorites.includes(doc.id) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                  {favorites.includes(doc.id) ? (
                    <FaHeart className="text-red-500 text-lg" />
                  ) : (
                    <FaRegHeart className="text-gray-400 hover:text-red-500 text-lg" />
                  )}
                </button>
                <button className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg transition-colors flex items-center">
                  <Download size={16} className="mr-2" /> Tải xuống
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
