'use client';

import React from 'react';
import Image from 'next/image';

const FeatureSection = () => {
  const features = [
    {
      title: 'Tài liệu chất lượng cao',
      description: 'Tiếp cận hàng triệu tài liệu học tập được đánh giá và kiểm duyệt.',
      icon: '/file.svg'
    },
    {
      title: 'Dễ dàng tìm kiếm',
      description: 'Tìm kiếm nhanh chóng với công cụ tìm kiếm thông minh theo từ khóa, danh mục hoặc tác giả.',
      icon: '/globe.svg'
    },
    {
      title: 'Học mọi lúc, mọi nơi',
      description: 'Truy cập tài liệu từ nhiều thiết bị khác nhau với giao diện thân thiện với người dùng.',
      icon: '/window.svg'
    }
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp nền tảng chia sẻ tài liệu học tập hàng đầu với các tính năng vượt trội
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-md text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-6">
                <Image src={feature.icon} alt={feature.title} width={32} height={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-blue-50 rounded-lg p-8 md:p-12">
          <div className="md:flex items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-4">Đăng ký để nhận tài liệu mới nhất</h3>
              <p className="text-gray-600 mb-6">
                Tham gia cùng hàng triệu học sinh, sinh viên và các nhà giáo dục trên toàn thế giới để chia sẻ và truy cập tài liệu học tập một cách miễn phí.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200">
                  Đăng ký ngay
                </button>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">5M+</span>
                  </div>
                  <span className="font-medium">Tài liệu học tập</span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">2M+</span>
                  </div>
                  <span className="font-medium">Người dùng</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-semibold">150+</span>
                  </div>
                  <span className="font-medium">Quốc gia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
