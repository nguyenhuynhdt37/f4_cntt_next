'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import {
    ArrowLeftIcon,
    BookOpenIcon,
    UserIcon,
    CalendarIcon,
    ClockIcon,
    ExclamationCircleIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

interface User {
    id: number;
    name: string;
    studentId: string;
    email: string;
    phoneNumber: string;
    department: string;
}

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    coverImage: string;
    availableQuantity: number;
}

interface BorrowFormData {
    userId: number;
    bookIds: number[];
    borrowDate: string;
    dueDate: string;
    notes: string;
}

// Mock data
const mockUsers: User[] = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        studentId: 'SV001',
        email: 'nguyenvana@example.com',
        phoneNumber: '0901234567',
        department: 'Công nghệ thông tin'
    },
    {
        id: 2,
        name: 'Trần Thị B',
        studentId: 'SV002',
        email: 'tranthib@example.com',
        phoneNumber: '0901234568',
        department: 'Kỹ thuật phần mềm'
    },
    {
        id: 3,
        name: 'Lê Văn C',
        studentId: 'SV003',
        email: 'levanc@example.com',
        phoneNumber: '0901234569',
        department: 'Khoa học máy tính'
    },
];

const mockBooks: Book[] = [
    {
        id: 1,
        title: 'Lập trình với Python',
        author: 'Nguyễn Văn A',
        isbn: '9781234567897',
        coverImage: '/images/book-covers/python-programming.jpg',
        availableQuantity: 3
    },
    {
        id: 2,
        title: 'Cơ sở dữ liệu nâng cao',
        author: 'Trần Thị B',
        isbn: '9781234567898',
        coverImage: '/images/book-covers/advanced-database.jpg',
        availableQuantity: 2
    },
    {
        id: 3,
        title: 'Machine Learning cơ bản',
        author: 'Lê Văn C',
        isbn: '9781234567899',
        coverImage: '/images/book-covers/machine-learning.jpg',
        availableQuantity: 0
    },
    {
        id: 4,
        title: 'Nhập môn trí tuệ nhân tạo',
        author: 'Phạm Thị D',
        isbn: '9781234567900',
        coverImage: '/images/book-covers/ai-intro.jpg',
        availableQuantity: 4
    },
];

const CreateBorrowRecord: React.FC = () => {
    const router = useRouter();
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);

    const [formData, setFormData] = useState<BorrowFormData>({
        userId: 0,
        bookIds: [],
        borrowDate: format(today, 'yyyy-MM-dd'),
        dueDate: format(twoWeeksLater, 'yyyy-MM-dd'),
        notes: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    // User search state
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showUserSearch, setShowUserSearch] = useState(false);

    // Book search state
    const [bookSearchQuery, setBookSearchQuery] = useState('');
    const [bookSearchResults, setBookSearchResults] = useState<Book[]>([]);
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
    const [showBookSearch, setShowBookSearch] = useState(false);

    // Handle user search
    useEffect(() => {
        if (userSearchQuery.trim() === '') {
            setUserSearchResults([]);
            return;
        }

        // In a real app this would be an API call
        const filteredUsers = mockUsers.filter(user =>
            user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
            user.studentId.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
        );

        setUserSearchResults(filteredUsers);
    }, [userSearchQuery]);

    // Handle book search
    useEffect(() => {
        if (bookSearchQuery.trim() === '') {
            setBookSearchResults([]);
            return;
        }

        // In a real app this would be an API call
        const filteredBooks = mockBooks.filter(book =>
            book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
            book.isbn.includes(bookSearchQuery)
        );

        setBookSearchResults(filteredBooks);
    }, [bookSearchQuery]);

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setFormData(prev => ({ ...prev, userId: user.id }));
        setShowUserSearch(false);
        setUserSearchQuery('');

        // Clear any user-related errors
        if (errors.userId) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.userId;
                return newErrors;
            });
        }
    };

    const handleBookSelect = (book: Book) => {
        // Don't add if book already selected or unavailable
        if (
            selectedBooks.some(b => b.id === book.id) ||
            book.availableQuantity <= 0
        ) {
            return;
        }

        const newSelectedBooks = [...selectedBooks, book];
        setSelectedBooks(newSelectedBooks);
        setFormData(prev => ({
            ...prev,
            bookIds: newSelectedBooks.map(b => b.id)
        }));
        setBookSearchQuery('');

        // Clear any book-related errors
        if (errors.bookIds) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.bookIds;
                return newErrors;
            });
        }
    };

    const handleRemoveBook = (bookId: number) => {
        const newSelectedBooks = selectedBooks.filter(book => book.id !== bookId);
        setSelectedBooks(newSelectedBooks);
        setFormData(prev => ({
            ...prev,
            bookIds: newSelectedBooks.map(b => b.id)
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear any errors for this field
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.userId) {
            newErrors.userId = 'Vui lòng chọn người mượn';
        }

        if (formData.bookIds.length === 0) {
            newErrors.bookIds = 'Vui lòng chọn ít nhất một cuốn sách';
        }

        if (!formData.borrowDate) {
            newErrors.borrowDate = 'Vui lòng chọn ngày mượn';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Vui lòng chọn ngày trả';
        }

        // Ensure due date is after borrow date
        if (formData.borrowDate && formData.dueDate) {
            const borrowDate = new Date(formData.borrowDate);
            const dueDate = new Date(formData.dueDate);

            if (dueDate <= borrowDate) {
                newErrors.dueDate = 'Ngày trả phải sau ngày mượn';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            // In a real app, this would be an API call to create a borrow record
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect on success
            router.push('/admin/library/borrow');
        } catch (error) {
            console.error('Error creating borrow record:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getBookAvailabilityStatus = (availableQuantity: number) => {
        if (availableQuantity <= 0) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Hết sách
                </span>
            );
        }

        if (availableQuantity <= 2) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Còn {availableQuantity} cuốn
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Còn {availableQuantity} cuốn
            </span>
        );
    };

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <Link href="/admin/library/borrow" className="mr-4 text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Tạo phiếu mượn sách</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* User Selection */}
                    <section>
                        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Thông tin người mượn
                        </h2>

                        {!selectedUser ? (
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm người mượn theo tên, mã sinh viên, email..."
                                        value={userSearchQuery}
                                        onChange={e => setUserSearchQuery(e.target.value)}
                                        onFocus={() => setShowUserSearch(true)}
                                        className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                {errors.userId && (
                                    <p className="mt-1 text-xs text-red-600">{errors.userId}</p>
                                )}

                                {showUserSearch && userSearchResults.length > 0 && (
                                    <div className="mt-2 border border-gray-300 rounded-md shadow-sm max-h-60 overflow-y-auto bg-white z-10">
                                        <ul>
                                            {userSearchResults.map(user => (
                                                <li
                                                    key={user.id}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-0"
                                                    onClick={() => handleUserSelect(user)}
                                                >
                                                    <div className="flex items-start">
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <UserIcon className="h-6 w-6 text-gray-500" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <p className="font-medium text-gray-900">{user.name}</p>
                                                            <div className="flex space-x-4 text-sm text-gray-500">
                                                                <p>MSSV: {user.studentId}</p>
                                                                <p>{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {showUserSearch && userSearchQuery && userSearchResults.length === 0 && (
                                    <div className="mt-2 border border-gray-300 rounded-md shadow-sm py-3 px-4 bg-white">
                                        <p className="text-gray-500">Không tìm thấy người dùng</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded-md bg-gray-50 p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <UserIcon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-medium text-gray-900">{selectedUser.name}</p>
                                            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-500">
                                                <p>MSSV: {selectedUser.studentId}</p>
                                                <p>Khoa: {selectedUser.department}</p>
                                                <p>Email: {selectedUser.email}</p>
                                                <p>SĐT: {selectedUser.phoneNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedUser(null);
                                            setFormData(prev => ({ ...prev, userId: 0 }));
                                        }}
                                        className="text-gray-500 hover:text-red-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Book Selection */}
                    <section>
                        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <BookOpenIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Sách mượn
                        </h2>

                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm sách theo tên, tác giả, ISBN..."
                                    value={bookSearchQuery}
                                    onChange={e => setBookSearchQuery(e.target.value)}
                                    onFocus={() => setShowBookSearch(true)}
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            {showBookSearch && bookSearchResults.length > 0 && (
                                <div className="mt-2 border border-gray-300 rounded-md shadow-sm max-h-72 overflow-y-auto bg-white z-10">
                                    <ul>
                                        {bookSearchResults.map(book => {
                                            const isSelected = selectedBooks.some(b => b.id === book.id);
                                            const isAvailable = book.availableQuantity > 0;

                                            return (
                                                <li
                                                    key={book.id}
                                                    className={`px-4 py-3 border-b border-gray-200 last:border-0 ${isSelected
                                                            ? 'bg-blue-50 cursor-default'
                                                            : isAvailable
                                                                ? 'hover:bg-gray-50 cursor-pointer'
                                                                : 'opacity-60 cursor-not-allowed'
                                                        }`}
                                                    onClick={() => isAvailable && !isSelected && handleBookSelect(book)}
                                                >
                                                    <div className="flex items-start">
                                                        <div className="h-16 w-12 bg-gray-100 rounded overflow-hidden relative">
                                                            {book.coverImage ? (
                                                                <Image
                                                                    src={book.coverImage}
                                                                    alt={book.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <BookOpenIcon className="h-6 w-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4 flex-1">
                                                            <div className="flex justify-between">
                                                                <p className="font-medium text-gray-900">{book.title}</p>
                                                                {getBookAvailabilityStatus(book.availableQuantity)}
                                                            </div>
                                                            <p className="text-sm text-gray-500">Tác giả: {book.author}</p>
                                                            <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            {showBookSearch && bookSearchQuery && bookSearchResults.length === 0 && (
                                <div className="mt-2 border border-gray-300 rounded-md shadow-sm py-3 px-4 bg-white">
                                    <p className="text-gray-500">Không tìm thấy sách phù hợp</p>
                                </div>
                            )}

                            {errors.bookIds && (
                                <p className="mt-2 text-xs text-red-600">{errors.bookIds}</p>
                            )}

                            {selectedBooks.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Sách đã chọn ({selectedBooks.length})</h3>
                                    <ul className="space-y-3">
                                        {selectedBooks.map(book => (
                                            <li key={book.id} className="bg-white border border-gray-300 rounded-md p-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-start">
                                                        <div className="h-16 w-12 bg-gray-100 rounded overflow-hidden relative">
                                                            {book.coverImage ? (
                                                                <Image
                                                                    src={book.coverImage}
                                                                    alt={book.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <BookOpenIcon className="h-6 w-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <p className="font-medium text-gray-900">{book.title}</p>
                                                            <p className="text-sm text-gray-500">Tác giả: {book.author}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveBook(book.id)}
                                                        className="text-gray-500 hover:text-red-600"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Borrow Details */}
                    <section>
                        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Thông tin mượn trả
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="borrowDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày mượn <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="borrowDate"
                                    name="borrowDate"
                                    value={formData.borrowDate}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-md border ${errors.borrowDate ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                />
                                {errors.borrowDate && (
                                    <p className="mt-1 text-xs text-red-600">{errors.borrowDate}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày trả dự kiến <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-md border ${errors.dueDate ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                />
                                {errors.dueDate && (
                                    <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Thêm ghi chú về việc mượn sách (nếu có)"
                            />
                        </div>
                    </section>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
                        <Link
                            href="/admin/library/borrow"
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Huỷ
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang xử lý...
                                </>
                            ) : (
                                'Tạo phiếu mượn'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBorrowRecord;
