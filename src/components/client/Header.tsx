'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">F4 CNTT</span>
            <span className="ml-2 text-xl font-semibold">Document</span>
          </Link>          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-medium text-sm text-gray-700 hover:text-blue-600">
              Trang chủ
            </Link>
            <Link href="/documents" className="font-medium text-sm text-gray-700 hover:text-blue-600">
              Tài liệu
            </Link>
            <Link href="/publishers" className="font-medium text-sm text-gray-700 hover:text-blue-600">
              Nhà xuất bản
            </Link>
            <Link href="/authors" className="font-medium text-sm text-gray-700 hover:text-blue-600">
              Tác giả
            </Link>
          </div>          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 rounded text-blue-600 hover:bg-blue-50 text-sm font-medium"
            >
              Đăng nhập
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 text-sm font-medium"
            >
              Đăng ký
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                href="/documents" 
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Tài liệu
              </Link>
              <Link 
                href="/publishers" 
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Nhà xuất bản
              </Link>
              <Link 
                href="/authors" 
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Tác giả
              </Link>
              <div className="pt-3 border-t border-gray-200 flex flex-col space-y-3">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-center text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 text-center bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
