"use client";

import React, { useState, useEffect, useRef } from "react";
import { Download, FileText, Calendar, User } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import Image from "next/image";
import Link from 'next/link';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
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

interface DocumentGridProps {
  documents: Document[];
}

export default function DocumentGrid({ documents }: DocumentGridProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [truncatedDescriptions, setTruncatedDescriptions] = useState<{ [key: string]: boolean }>({});
  const descriptionRefs = useRef<{ [key: string]: HTMLParagraphElement | null }>({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Kiểm tra xem mô tả có bị cắt hay không
  useEffect(() => {
    const checkTruncation = () => {
      const newTruncated: { [key: string]: boolean } = {};

      Object.keys(descriptionRefs.current).forEach(id => {
        const element = descriptionRefs.current[id];
        if (element) {
          newTruncated[id] = element.scrollHeight > element.clientHeight;
        }
      });

      setTruncatedDescriptions(newTruncated);
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);

    return () => window.removeEventListener('resize', checkTruncation);
  }, [documents]);

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700 flex flex-col h-full"
        >
          <div className={`h-3 w-full ${doc.color}`}></div>
          <div className="relative h-48">
            <div className={`absolute inset-0 ${doc.color} opacity-20`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {doc.thumbnailUrl ? (
                <Image
                  src={doc.thumbnailUrl}
                  alt={doc.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <FileText size={64} className="text-gray-400" />
              )}
            </div>
          </div>
          <CardContent className="px-3 py-4 flex-grow">            <div className="flex justify-between items-start mb-3">
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge className={`${doc.color} bg-opacity-90 text-white`}>
                {doc.category}
              </Badge>
              {doc.isPremium && doc.score && doc.score > 0 ? (
                <Badge className="bg-green-600 text-white">
                  {doc.score} điểm
                </Badge>
              ) : (
                <Badge className="bg-gray-500 text-white">
                  Miễn phí
                </Badge>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(doc.id);
              }}
              className="flex items-center justify-center p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={favorites.includes(doc.id) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            >
              {favorites.includes(doc.id) ? (
                <FaHeart className="text-red-500 text-lg" />
              ) : (
                <FaRegHeart className="text-gray-400 hover:text-red-500 text-lg" />
              )}
            </button>
          </div>
            <Link href={`/documents/details/${doc.id}`} key={doc.id} className="block">
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{doc.title}</h3>
            </Link>
            <div className="relative mb-4">
              <p

                className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2"
              >
                {doc.description}
              </p>
              {truncatedDescriptions[doc.id] && (
                <span className="text-gray-600 dark:text-gray-300 text-sm">...</span>
              )}
            </div>            {doc.averageRating !== undefined && (
              <div className="mb-3">
                <StarRating rating={doc.averageRating} size="sm" showText totalRatings={doc.totalRatings} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span className="truncate">{doc.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(doc.uploadDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText size={14} />
                <span>{doc.fileType.toUpperCase()} ({doc.fileSize})</span>
              </div>
              <div className="flex items-center gap-1">
                <Download size={14} />
                <span>{doc.downloadCount.toLocaleString("vi-VN")}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-0">
            {/* <button className="cursor-pointer text-sm w-full py-3 font-medium text-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              Tải xuống
            </button> */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
