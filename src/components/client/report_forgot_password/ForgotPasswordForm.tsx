import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { forgotPassword } from '@/api/axios/auth';

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPasswordForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>();

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsSubmitting(true);
        try {
            await forgotPassword(data.email);
            setEmailSent(true);
            toast.success('Liên kết đặt lại mật khẩu đã được gửi tới email của bạn.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            toast.error('Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBaseClasses = (hasError: boolean) =>
        `appearance-none block w-full bg-white text-gray-800 placeholder-gray-400 border ${hasError
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500'
        } rounded-lg py-3 px-4 pl-12 text-base leading-tight focus:outline-none focus:bg-white focus:ring-1 transition-colors duration-150 ease-in-out`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100">
            <div className="bg-indigo-600 pb-32 pt-10 sm:pt-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-white">Quên mật khẩu</h1>
                    <p className="mt-2 text-base text-indigo-200">
                        Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.
                    </p>
                </div>
            </div>

            <main className="-mt-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                        {!emailSent ? (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="px-6 py-8 sm:p-10">
                                    <div className="pb-6 border-b border-gray-200">
                                        <h2 className="text-xl leading-7 font-semibold text-gray-900">
                                            Khôi phục mật khẩu
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Vui lòng nhập email đã đăng ký với tài khoản của bạn. Chúng tôi sẽ gửi một liên kết đặt lại mật khẩu đến địa chỉ email này.
                                        </p>
                                    </div>

                                    <div className="mt-8">
                                        <label
                                            htmlFor="email"
                                            className="block text-base font-medium text-gray-700 mb-2"
                                        >
                                            Email
                                        </label>
                                        <div className="relative rounded-md">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <FaEnvelope className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                placeholder="email@example.com"
                                                {...register('email', {
                                                    required: 'Vui lòng nhập địa chỉ email',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Địa chỉ email không hợp lệ',
                                                    },
                                                })}
                                                className={inputBaseClasses(!!errors.email)}
                                            />
                                            {errors.email && (
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <FaExclamationCircle className="h-5 w-5 text-red-500" />
                                                </div>
                                            )}
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="px-6 py-5 sm:px-10 bg-gray-50 border-t border-gray-200 text-right">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`inline-flex items-center justify-center rounded-lg border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out
                    ${isSubmitting
                                                ? 'bg-indigo-400 cursor-not-allowed hover:bg-indigo-400'
                                                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 active:bg-indigo-800 transform hover:scale-105 active:scale-100'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                Đang gửi...
                                            </>
                                        ) : (
                                            'Gửi liên kết đặt lại mật khẩu'
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="px-6 py-10 sm:p-10 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 className="mt-3 text-lg font-medium text-gray-900">Đã gửi email!</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Chúng tôi đã gửi một email chứa liên kết đặt lại mật khẩu đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn.
                                </p>
                                <p className="mt-4 text-sm text-gray-500">
                                    Liên kết có hiệu lực trong 15 phút. Nếu bạn không nhận được email, vui lòng kiểm tra thư mục spam.
                                </p>
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setEmailSent(false)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Gửi lại
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPasswordForm;
