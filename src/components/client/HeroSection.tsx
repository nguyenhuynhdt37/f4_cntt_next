'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Tìm kiếm, chia sẻ và học từ hàng triệu tài liệu
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Khám phá kho tài liệu học tập từ sinh viên và giáo viên trên toàn thế giới
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Tìm tài liệu, sách, tài liệu học tập..."
              className="bg-white text-sm flex-1 px-4 py-3 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-3 text-sm bg-green-500 hover:bg-green-600 rounded-md font-medium transition duration-200"
            >
              Tìm kiếm
            </button>
          </form>
          
          <div className="mt-6 text-sm opacity-80">
            <p>Tài liệu phổ biến: 
              <button onClick={() => setSearchQuery('Lập trình')} className="ml-2 underline">Lập trình</button>,
              <button onClick={() => setSearchQuery('Marketing')} className="ml-2 underline">Marketing</button>,
              <button onClick={() => setSearchQuery('Kinh tế')} className="ml-2 underline">Kinh tế</button>,
              <button onClick={() => setSearchQuery('Ngoại ngữ')} className="ml-2 underline">Ngoại ngữ</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
