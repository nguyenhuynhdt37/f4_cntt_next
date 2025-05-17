import { Suspense } from 'react';

// Import các client components
import Header from '@/components/client/Header';
import HeroSection from '@/components/client/HeroSection';
import Slides from '@/components/client/Slides';
import PopularCategories from '@/components/client/PopularCategories';
import FeatureSection from '@/components/client/FeatureSection';
import RecentDocuments from '@/components/client/RecentDocuments';
import Footer from '@/components/client/Footer';

// Đánh dấu trang là server component bằng cách sử dụng 'use server' hoặc không đánh dấu 'use client'
export default function Page() {
  return (
    <>      <Header />
      <HeroSection />
      
      <Suspense fallback={<div className="h-80 flex items-center justify-center">Đang tải danh mục...</div>}>
        <PopularCategories />
      </Suspense>

      <Slides />
      
      <Suspense fallback={<div className="h-80 flex items-center justify-center">Đang tải tài liệu...</div>}>
        <RecentDocuments />
      </Suspense>
      
      <FeatureSection />
      <Footer />
    </>
  );
}