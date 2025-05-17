"use client";

import { FileText, Download, Calendar, BookOpen, Eye, User as UserIcon } from "lucide-react";
import { Badge } from "../../../ui/badge";
import Link from "next/link";
import Image from "next/image";

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
  thumbnailUrl?: string;
  color: string;
}

interface RelatedDocumentsProps {
  documents: Document[];
}

export default function RelatedDocuments({ documents }: RelatedDocumentsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(date);
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <FileText className="h-5 w-5 mr-2 text-indigo-500" />
          Tài liệu liên quan
        </h2>
        <Link href="/documents" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Xem tất cả
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <Link href={`/documents/details/${doc.id}`} key={doc.id} className="group">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full bg-white dark:bg-gray-800">
              <div className={`h-2 w-full ${doc.color}`}></div>
              <div className="p-4 flex flex-col h-full">
                <div className="mb-3 flex justify-between">
                  <Badge className={`${doc.color} bg-opacity-90 text-white`}>
                    {doc.category}
                  </Badge>
                  <span className="text-xs flex items-center text-gray-500">
                    <Eye className="h-3 w-3 mr-1" /> 
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">Xem chi tiết</span>
                  </span>
                </div>
                
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {doc.title}
                </h3>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 mt-auto">
                  <div className="flex items-center">
                    <UserIcon className="h-3 w-3 mr-1.5 text-indigo-500" />
                    <span className="truncate">{doc.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1.5 text-indigo-500" />
                    <span>{formatDate(doc.uploadDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1.5 text-indigo-500" />
                      <span>{doc.fileType.toUpperCase()}</span>
                    </span>
                    <span className="flex items-center">
                      <Download className="h-3 w-3 mr-1.5 text-indigo-500" />
                      <span>{doc.downloadCount.toLocaleString("vi-VN")}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
