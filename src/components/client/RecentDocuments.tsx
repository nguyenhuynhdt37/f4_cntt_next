'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Document = {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  views: number;
  thumbnail: string;
};

const RecentDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetching
    // In a real application, you would fetch from an API
    const sampleDocuments: Document[] = [
      {
        id: '1',
        title: 'Giáo trình lập trình web với React và Next.js',
        author: 'Nguyễn Văn A',
        category: 'Công nghệ thông tin',
        pages: 120,
        views: 1240,
        thumbnail: 'https://placehold.co/400x500/e6f7ff/0a85ff.png?text=React+Next.js'
      },
      {
        id: '2',
        title: 'Nhập môn Trí tuệ nhân tạo và Học máy',
        author: 'Trần Thị B',
        category: 'Công nghệ thông tin',
        pages: 180,
        views: 2300,
        thumbnail: 'https://placehold.co/400x500/fff5e6/ff8c0a.png?text=AI+ML'
      },
      {
        id: '3',
        title: 'Nguyên lý Marketing hiện đại',
        author: 'Lê Văn C',
        category: 'Kinh tế',
        pages: 150,
        views: 1850,
        thumbnail: 'https://placehold.co/400x500/f7ffe6/85ff0a.png?text=Marketing'
      },
      {
        id: '4',
        title: 'Tiếng Anh chuyên ngành CNTT',
        author: 'Phạm Thị D',
        category: 'Ngoại ngữ',
        pages: 90,
        views: 3100,
        thumbnail: 'https://placehold.co/400x500/ffe6f7/ff0a85.png?text=English+IT'
      }
    ];

    setTimeout(() => {
      setDocuments(sampleDocuments);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Tài liệu mới nhất</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Tài liệu mới nhất</h2>
          <Link href="/documents" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
            Xem tất cả
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <Link href={`/documents/${doc.id}`} key={doc.id} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg h-full flex flex-col">                <div className="h-48 relative overflow-hidden">
                  <Image 
                    src={doc.thumbnail} 
                    alt={doc.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-xs font-semibold text-blue-600 mb-2">{doc.category}</span>
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Tác giả: {doc.author}
                  </p>
                  <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                    <span>{doc.pages} trang</span>
                    <span>{doc.views.toLocaleString()} lượt xem</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentDocuments;
