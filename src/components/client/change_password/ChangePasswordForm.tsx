import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { changePassword } from '@/api/axios/user';
import { FaKey, FaEye, FaEyeSlash, FaSpinner, FaSave, FaExclamationCircle } from 'react-icons/fa';

interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePasswordForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const newPasswordValue = watch('newPassword');

    const onSubmit = async (data: ChangePasswordFormData) => {
        setIsSubmitting(true);
        try {
            await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            toast.success('Đổi mật khẩu thành công!');
            reset(); // Reset form về giá trị mặc định sau khi đổi thành công
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra mật khẩu hiện tại và thử lại.');
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
                    <h1 className="text-4xl font-bold tracking-tight text-white">Đổi mật khẩu</h1>
                    <p className="mt-2 text-base text-indigo-200">
                        Cập nhật mật khẩu của bạn để bảo vệ tài khoản.
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
                                        Thay đổi mật khẩu
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.
                                    </p>
                                </div>

                                <div className="mt-8 grid grid-cols-1 gap-y-8 gap-x-6">
                                    {/* Mật khẩu hiện tại */}
                                    <div>
                                        <label
                                            htmlFor="currentPassword"
                                            className="block text-base font-medium text-gray-700 mb-2"
                                        >
                                            Mật khẩu hiện tại
                                        </label>
                                        <div className="relative rounded-md">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <FaKey className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                id="currentPassword"
                                                {...register('currentPassword', {
                                                    required: 'Vui lòng nhập mật khẩu hiện tại',
                                                })}
                                                className={inputBaseClasses(!!errors.currentPassword)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                            >
                                                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.currentPassword && (
                                            <p className="mt-2 text-sm text-red-600">{errors.currentPassword.message}</p>
                                        )}
                                    </div>

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
                                                type={showNewPassword ? 'text' : 'password'}
                                                id="newPassword"
                                                {...register('newPassword', {
                                                    required: 'Vui lòng nhập mật khẩu mới',
                                                    minLength: {
                                                        value: 6,
                                                        message: 'Mật khẩu phải có ít nhất 6 ký tự',
                                                    },
                                                    validate: (value) =>
                                                        value !== watch('currentPassword') ||
                                                        'Mật khẩu mới không được trùng với mật khẩu hiện tại',
                                                })}
                                                className={inputBaseClasses(!!errors.newPassword)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.newPassword && (
                                            <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>
                                        )}
                                    </div>

                                    {/* Xác nhận mật khẩu mới */}
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

                            {/* Action Buttons Footer */}
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
                                        <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    ) : (
                                        <FaSave className="-ml-1 mr-2 h-5 w-5" />
                                    )}
                                    {isSubmitting ? 'Đang lưu...' : 'Đổi mật khẩu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChangePasswordForm;
