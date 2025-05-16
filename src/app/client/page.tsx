'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Hero Section with Navigation */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <Link href="/">
                                <div className="flex items-center">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/2784/2784482.png"
                                        alt="SenseLib Logo"
                                        className="h-10 w-10 mr-2"
                                    />
                                    <span className="text-xl font-medium text-blue-800">SenseLib</span>
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href="/search" className="text-gray-600 hover:text-gray-900">
                                Tìm kiếm
                            </Link>
                            <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                                Danh mục
                            </Link>
                            <Link href="/about" className="text-gray-600 hover:text-gray-900">
                                Giới thiệu
                            </Link>
                            <Link href="/login">
                                <button className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Đăng nhập
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Đăng ký
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                SenseLib - Tri thức cho cộng đồng
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Kho tài liệu học tập với hàng ngàn tài liệu chất lượng cao, từ sách giáo khoa đến giáo trình đại học. Tiếp cận tri thức một cách dễ dàng và hiệu quả.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/search">
                                    <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                                        Tìm tài liệu ngay
                                    </button>
                                </Link>
                                <Link href="/categories">
                                    <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                                        Khám phá danh mục
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center">
                            <img
                                src="https://img.freepik.com/free-vector/education-pattern-background-doodle-style_53876-115365.jpg"
                                alt="Library Illustration"
                                className="w-full max-w-md rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Tại sao chọn SenseLib?</h2>
                        <p className="mt-4 text-xl text-gray-600">Những lý do giúp chúng tôi trở thành lựa chọn hàng đầu</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tài liệu chất lượng cao</h3>
                            <p className="text-gray-600">
                                Tất cả tài liệu trên SenseLib đều được kiểm duyệt kỹ càng, đảm bảo chất lượng và tính chính xác.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Đa dạng lĩnh vực</h3>
                            <p className="text-gray-600">
                                Với hơn 15 danh mục và 100+ lĩnh vực khoa học, SenseLib đáp ứng mọi nhu cầu học tập của bạn.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cộng đồng năng động</h3>
                            <p className="text-gray-600">
                                Kết nối với cộng đồng người học, trao đổi kiến thức và chia sẻ tài liệu quý giá.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Preview Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Khám phá danh mục</h2>
                        <p className="mt-4 text-xl text-gray-600">Tìm kiếm tài liệu theo lĩnh vực quan tâm</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Công nghệ thông tin', icon: '💻', color: 'bg-blue-100' },
                            { name: 'Kinh tế - Quản trị', icon: '📊', color: 'bg-green-100' },
                            { name: 'Kỹ thuật - Công nghệ', icon: '⚙️', color: 'bg-yellow-100' },
                            { name: 'Y học - Sức khỏe', icon: '🩺', color: 'bg-red-100' },
                            { name: 'Khoa học tự nhiên', icon: '🔬', color: 'bg-purple-100' },
                            { name: 'Khoa học xã hội', icon: '🌍', color: 'bg-indigo-100' },
                            { name: 'Ngoại ngữ', icon: '🗣️', color: 'bg-pink-100' },
                            { name: 'Luật - Chính trị', icon: '⚖️', color: 'bg-orange-100' }
                        ].map((category, index) => (
                            <Link key={index} href={`/categories/${category.name.toLowerCase().replace(/ /g, '-')}`}>
                                <div className={`${category.color} p-6 rounded-lg hover:shadow-md transition-shadow text-center cursor-pointer`}>
                                    <div className="text-4xl mb-2">{category.icon}</div>
                                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link href="/categories">
                            <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                                Xem tất cả danh mục
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent Documents Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Tài liệu mới cập nhật</h2>
                        <p className="mt-4 text-xl text-gray-600">Các tài liệu chất lượng vừa được thêm vào thư viện</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Lập trình Python cơ bản và nâng cao', type: 'Sách', pages: 320, thumbnail: 'https://cdn-icons-png.flaticon.com/512/3771/3771417.png' },
                            { title: 'Bài giảng Kinh tế vĩ mô', type: 'Bài giảng', pages: 78, thumbnail: 'https://cdn-icons-png.flaticon.com/512/3771/3771347.png' },
                            { title: 'Hướng dẫn phân tích dữ liệu với R', type: 'Tài liệu', pages: 156, thumbnail: 'https://cdn-icons-png.flaticon.com/512/3771/3771364.png' },
                            { title: 'Nguyên lý kế toán', type: 'Giáo trình', pages: 245, thumbnail: 'https://cdn-icons-png.flaticon.com/512/3771/3771445.png' }
                        ].map((doc, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-40 bg-gray-200 flex items-center justify-center">
                                    <img src={doc.thumbnail} alt={doc.title} className="h-32" />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-blue-700 hover:text-blue-800 mb-2">{doc.title}</h3>
                                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                                        <span className="flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                                            </svg>
                                            {doc.type}
                                        </span>
                                        <span className="flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm1 8a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                                            </svg>
                                            {doc.pages} trang
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <Link href={`/document/${index + 1}`}>
                                            <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                                                Xem chi tiết
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link href="/search">
                            <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                                Xem thêm tài liệu
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Đăng ký để trải nghiệm đầy đủ tính năng</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Trở thành thành viên để tải xuống tài liệu không giới hạn, lưu tài liệu yêu thích và đóng góp cho cộng đồng.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/register">
                            <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors">
                                Đăng ký ngay
                            </button>
                        </Link>
                        <Link href="/login">
                            <button className="px-8 py-3 bg-transparent text-white font-medium rounded-md border border-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors">
                                Đăng nhập
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/2784/2784482.png"
                                    alt="SenseLib Logo"
                                    className="h-8 w-8 mr-2 bg-white rounded p-1"
                                />
                                <span className="text-xl font-bold text-white">SenseLib</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Tri thức cho cộng đồng - Nền tảng chia sẻ tài liệu học tập hàng đầu Việt Nam
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Danh mục phổ biến</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Công nghệ thông tin</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Kinh tế - Quản trị</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Kỹ thuật - Công nghệ</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Y học - Sức khỏe</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Khoa học tự nhiên</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Liên kết</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Trang chủ</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Tìm kiếm</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Danh mục</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Đăng nhập</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Đăng ký</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Thông tin</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Về chúng tôi</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Điều khoản sử dụng</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Chính sách bảo mật</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Hỗ trợ</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Liên hệ</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                        <p className="text-gray-400">
                            &copy; 2025 SenseLib. Tất cả các quyền được bảo lưu.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage; 