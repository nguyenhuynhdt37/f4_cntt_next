import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tìm kiếm tài liệu | SenseLib - Tri thức cho cộng đồng',
    description: 'Tìm kiếm tài liệu học tập, sách, bài giảng và nhiều tài nguyên học tập khác tại SenseLib',
    keywords: 'tài liệu học tập, sách, ebook, tìm kiếm, thư viện số',
};

export default function SearchPage({
    searchParams,
}: {
    searchParams?: { query?: string; page?: string };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    // Mocked search results
    const mockResults = [
        {
            id: 1,
            title: 'Giáo trình Kỹ thuật lập trình C++',
            university: 'Đại học Bách Khoa Hà Nội',
            type: 'Giáo trình',
            pages: 125,
            year: 2022,
            views: 2580,
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/3771/3771417.png'
        },
        {
            id: 2,
            title: 'Bài giảng Kinh tế vĩ mô',
            university: 'Đại học Kinh tế Quốc dân',
            type: 'Bài giảng',
            pages: 78,
            year: 2023,
            views: 1890,
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/3771/3771347.png'
        },
        {
            id: 3,
            title: 'Đề cương ôn tập Toán cao cấp',
            university: 'Đại học Khoa học Tự nhiên',
            type: 'Đề cương',
            pages: 45,
            year: 2023,
            views: 3420,
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/3771/3771364.png'
        },
        {
            id: 4,
            title: 'Giáo trình Cơ sở dữ liệu',
            university: 'Đại học Công nghệ Thông tin',
            type: 'Giáo trình',
            pages: 210,
            year: 2021,
            views: 2970,
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/2784/2784482.png'
        },
        {
            id: 5,
            title: 'Bài tập Lập trình hướng đối tượng',
            university: 'Đại học Bách Khoa Hà Nội',
            type: 'Bài tập',
            pages: 56,
            year: 2022,
            views: 1560,
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/3771/3771445.png'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <Link href="/">
                                <div className="flex items-center">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/2784/2784482.png"
                                        alt="SenseLib Logo"
                                        className="h-8 w-8 mr-2"
                                    />
                                    <span className="text-xl font-medium text-blue-800">SenseLib</span>
                                </div>
                            </Link>
                        </div>

                        <div className="flex-1 max-w-2xl mx-8">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tài liệu, sách giáo trình..."
                                    defaultValue={query}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Link href="/login">
                                <button className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Đăng nhập
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="ml-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Đăng ký
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Filters sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>

                            <div className="space-y-5">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Loại tài liệu</h4>
                                    <div className="space-y-2">
                                        {['Tất cả', 'Sách', 'Giáo trình', 'Bài giảng', 'Báo cáo', 'Luận văn', 'Đề thi'].map((type) => (
                                            <div key={type} className="flex items-center">
                                                <input
                                                    id={`type-${type}`}
                                                    name="document-type"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    defaultChecked={type === 'Tất cả'}
                                                />
                                                <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                                                    {type}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Năm xuất bản</h4>
                                    <div className="space-y-2">
                                        {['2023', '2022', '2021', '2020', '2019', 'Trước 2019'].map((year) => (
                                            <div key={year} className="flex items-center">
                                                <input
                                                    id={`year-${year}`}
                                                    name="publish-year"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`year-${year}`} className="ml-2 text-sm text-gray-700">
                                                    {year}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Trường đại học</h4>
                                    <div className="space-y-2">
                                        {['Đại học Bách Khoa Hà Nội', 'Đại học Quốc gia Hà Nội', 'Đại học Kinh tế Quốc dân', 'Đại học Ngoại thương', 'Đại học Y Hà Nội'].map((uni) => (
                                            <div key={uni} className="flex items-center">
                                                <input
                                                    id={`uni-${uni}`}
                                                    name="university"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`uni-${uni}`} className="ml-2 text-sm text-gray-700 truncate">
                                                    {uni}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search results */}
                    <div className="flex-1">
                        <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Kết quả tìm kiếm {query && <span>cho "{query}"</span>}
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">Tìm thấy {mockResults.length} kết quả</p>

                            <div className="space-y-6">
                                {mockResults.map((document) => (
                                    <div key={document.id} className="flex border-b border-gray-200 pb-5">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={document.imageUrl}
                                                alt={document.title}
                                                className="w-20 h-28 object-cover shadow-sm"
                                            />
                                        </div>
                                        <div className="ml-5 flex-1">
                                            <h3 className="text-lg font-medium text-blue-700 hover:text-blue-800">
                                                <Link href={`/document/${document.id}`}>
                                                    {document.title}
                                                </Link>
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{document.university}</p>
                                            <div className="flex items-center text-xs text-gray-500 mt-2 flex-wrap gap-3">
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                                                    </svg>
                                                    {document.type}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm1 8a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                                                    </svg>
                                                    {document.pages} trang
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                                    </svg>
                                                    {document.year}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {document.views.toLocaleString()} lượt xem
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    Tải xuống
                                                </button>
                                                <button className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                                    </svg>
                                                    Lưu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-8 flex justify-center">
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <a
                                        href="#"
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    {[1, 2, 3, 4, 5].map((page) => (
                                        <a
                                            key={page}
                                            href={`?query=${query}&page=${page}`}
                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </a>
                                    ))}
                                    <a
                                        href="#"
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/2784/2784482.png"
                                alt="SenseLib Logo"
                                className="h-10 w-10"
                            />
                            <span className="ml-2 text-xl font-medium text-gray-900">SenseLib</span>
                        </div>
                        <p className="mt-2 text-base text-gray-500">
                            Tri thức cho cộng đồng
                        </p>
                        <div className="mt-8 flex justify-center space-x-6">
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
                        <div className="flex space-x-6 md:order-2">
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                                Về chúng tôi
                            </a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                                Điều khoản sử dụng
                            </a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                                Chính sách bảo mật
                            </a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                                Trợ giúp
                            </a>
                        </div>
                        <p className="mt-8 text-sm text-gray-500 md:mt-0 md:order-1">
                            &copy; 2025 SenseLib. Tất cả các quyền được bảo lưu.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 