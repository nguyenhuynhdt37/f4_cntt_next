import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaKey, FaEye, FaEyeSlash, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { resetPassword } from '@/api/axios/auth';

interface ResetPasswordFormData {
    newPassword: string;
    confirmPassword: string;
}

const ResetPasswordForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormData>();

    const newPasswordValue = watch('newPassword');

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            toast.error('Token không hợp lệ. Vui lòng thử lại hoặc yêu cầu liên kết đặt lại mật khẩu mới.');
            return;
        }

        setIsSubmitting(true);
        try {
            await resetPassword({
                token,
                newPassword: data.newPassword
            });

            toast.success('Đặt lại mật khẩu thành công!');
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Không thể đặt lại mật khẩu. Token có thể đã hết hạn.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBaseClasses = (hasError: boolean) =>
        `appearance-none block w-full bg-white text-gray-800 placeholder-gray-400 border ${hasError
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500'
        } rounded-lg py-3 px-4 pl-12 text-base leading-tight focus:outline-none focus:bg-white focus:ring-1 transition-colors duration-150 ease-in-out`;

    // Nếu không tìm thấy token, hiển thị thông báo lỗi
    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
                    <div className="bg-red-100 p-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-200">
                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-red-800">Liên kết không hợp lệ!</h3>
                        <p className="mt-2 text-sm text-red-700">
                            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.
                        </p>
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() => router.push('/report_forgot_password')}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Quay lại trang quên mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100">
            <div className="bg-indigo-600 pb-32 pt-10 sm:pt-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-white">Đặt lại mật khẩu</h1>
                    <p className="mt-2 text-base text-indigo-200">
                        Tạo mật khẩu mới cho tài khoản của bạn.
                    </p>
                </div>
            </div>

            <main className="-mt-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="px-6 py-8 sm:p-10">
                                <div className="pb-6 border-b border-gray-200">
                                    <h2 className="text-xl leading-7 font-semibold text-gray-900">
                                        Tạo mật khẩu mới
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Nhập mật khẩu mới cho tài khoản của bạn. Mật khẩu phải có ít nhất 6 ký tự.
                                    </p>
                                </div>

                                <div className="mt-8 grid grid-cols-1 gap-y-6">
                                    {/* Mật khẩu mới */}
                                    <div>
                                        <label
                                            htmlFor="newPassword"
                                            className="block text-base font-medium text-gray-700 mb-2"
                                        >
                                            Mật khẩu mới
                                        </label>
                                        <div className="relative rounded-md">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <FaKey className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="newPassword"
                                                {...register('newPassword', {
                                                    required: 'Vui lòng nhập mật khẩu mới',
                                                    minLength: {
                                                        value: 6,
                                                        message: 'Mật khẩu phải có ít nhất 6 ký tự',
                                                    }
                                                })}
                                                className={inputBaseClasses(!!errors.newPassword)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.newPassword && (
                                            <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>
                                        )}
                                    </div>

                                    {/* Xác nhận mật khẩu */}
                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block text-base font-medium text-gray-700 mb-2"
                                        >
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <div className="relative rounded-md">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <FaKey className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                id="confirmPassword"
                                                {...register('confirmPassword', {
                                                    required: 'Vui lòng xác nhận mật khẩu mới',
                                                    validate: (value) =>
                                                        value === newPasswordValue || 'Mật khẩu xác nhận không khớp',
                                                })}
                                                className={inputBaseClasses(!!errors.confirmPassword)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>
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
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        'Đặt lại mật khẩu'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResetPasswordForm;
