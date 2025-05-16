import Link from 'next/link';
import React from 'react';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col">
      <Link href={'/'}>
        <div className="flex cursor-pointer text-xl font-medium items-center p-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2784/2784482.png"
            alt="SenseLib Logo"
            className="w-12 h-12 mr-3"
          />
          <span className="text-blue-800">SenseLib</span>
        </div>
      </Link>

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <h1 className="text-6xl font-bold text-blue-800 mb-4">404</h1>

          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Không tìm thấy nội dung
          </h2>

          <div className="text-gray-600 text-lg mb-8">
            <p className="mb-2">
              URL của nội dung này đã bị thay đổi hoặc không còn tồn tại.
            </p>
            <p>
              Nếu bạn đang lưu URL này, hãy thử truy cập lại từ trang chủ thay
              vì dùng URL đã lưu.
            </p>
          </div>

          <Link href={'/'}>
            <button className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
              </svg>
              Về trang chủ
            </button>
          </Link>

          <div className="mt-12 text-sm text-gray-500">
            © 2025 SenseLib. Tri thức cho cộng đồng.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
