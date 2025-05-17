'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CategoryCardProps = {
  title: string;
  icon: string;
  count: number;
  href: string;
};

const CategoryCard = ({ title, icon, count, href }: CategoryCardProps) => (
  <Link href={href} className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg hover:scale-105">
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-blue-100 rounded-full">
        <Image src={icon} alt={title} width={32} height={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{count} tài liệu</p>
    </div>
  </Link>
);

const PopularCategories = () => {
  const categories = [
    { title: 'Công nghệ thông tin', icon: '/file.svg', count: 12500, href: '/documents?category=it' },
    { title: 'Kinh tế', icon: '/file.svg', count: 9800, href: '/documents?category=economics' },
    { title: 'Ngoại ngữ', icon: '/file.svg', count: 8400, href: '/documents?category=language' },
    { title: 'Kỹ thuật', icon: '/file.svg', count: 7600, href: '/documents?category=engineering' },
    { title: 'Y dược', icon: '/file.svg', count: 6300, href: '/documents?category=medicine' },
    { title: 'Khoa học xã hội', icon: '/file.svg', count: 5400, href: '/documents?category=social-science' },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Danh mục phổ biến</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Khám phá các tài liệu theo danh mục phổ biến từ các trường đại học và chuyên ngành khác nhau
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/documents" className="text-sm inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Xem tất cả danh mục
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
