import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { updateProfile } from '@/api/axios/user';
import {
  FaUser, FaEnvelope, FaKey, FaSpinner, FaExclamationCircle, FaEye, FaEyeSlash, FaSave
} from 'react-icons/fa';

interface ProfileFormData {
  fullName: string;
  username: string;
  email: string;
  newPassword?: string; // Mật khẩu mới là tùy chọn
  confirmNewPassword?: string;
}

interface UserData {
  id?: string | number;
  fullName?: string;
  username?: string;
  email?: string;
  role_id?: string;
  role?: string;
  is_active?: boolean;
  avatar?: string;
}


const ProfileForm = ({ userData }: { userData: UserData | null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      newPassword: '',
      confirmNewPassword: '',
    }
  });

  const newPasswordValue = watch('newPassword');

  useEffect(() => {
    if (userData) {
      const newValues = {
        fullName: userData.fullName || '',
        username: userData.username || '',
        email: userData.email || '',
        newPassword: '',
        confirmNewPassword: '',
      };
      reset(newValues, { keepDirty: false });
    }
  }, [userData, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    // Nếu không nhập mật khẩu mới, không gửi newPassword và confirmNewPassword
    const submissionData: Partial<ProfileFormData> = { ...data };
    if (!data.newPassword) {
      delete submissionData.newPassword;
      delete submissionData.confirmNewPassword;
    }

    try {
      console.log('Submitting data:', submissionData);
      await updateProfile(submissionData as any);
      toast.success('Cập nhật thông tin thành công!');
      // Reset form, giữ lại các giá trị vừa submit nhưng xóa mật khẩu
      const resetValues = { ...data, newPassword: '', confirmNewPassword: '' };
      reset(resetValues, { keepDirty: false });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClasses = (hasError: boolean) =>
    `appearance-none block w-full bg-white text-gray-800 placeholder-gray-400 border ${hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500'
    } rounded-lg py-3 px-4 pl-12 text-base leading-tight focus:outline-none focus:bg-white focus:ring-1 transition-colors duration-150 ease-in-out`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100">
      <div className="bg-indigo-600 pb-32 pt-10 sm:pt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Chỉnh sửa hồ sơ
          </h1>
          <p className="mt-2 text-base text-indigo-200">
            Cập nhật thông tin tài khoản của bạn.
          </p>
        </div>
      </div>

      <main className="-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Section 1: Thông tin cơ bản */}
              <div className="px-6 py-8 sm:p-10">
                <div className="pb-6 border-b border-gray-200">
                  <h2 className="text-xl leading-7 font-semibold text-gray-900">
                    Thông tin cơ bản
                  </h2>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                  {/* Họ và tên */}
                  <div className="sm:col-span-3">
                    <label htmlFor="fullName" className="block text-base font-medium text-gray-700 mb-2">Họ và tên</label>
                    <div className="relative rounded-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><FaUser className="h-5 w-5 text-gray-400" /></div>
                      <input type="text" id="fullName" placeholder="Nguyễn Văn A" {...register('fullName', { required: 'Vui lòng nhập họ tên' })} className={inputBaseClasses(!!errors.fullName)} />
                      {errors.fullName && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4"><FaExclamationCircle className="h-5 w-5 text-red-500" /></div>}
                    </div>
                    {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
                  </div>

                  {/* Tên đăng nhập */}
                  <div className="sm:col-span-3">
                    <label htmlFor="username" className="block text-base font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                    <div className="relative rounded-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><FaUser className="h-5 w-5 text-gray-400" /></div>
                      <input type="text" id="username" placeholder="nguyenvana" {...register('username', { required: 'Vui lòng nhập tên đăng nhập' })} className={inputBaseClasses(!!errors.username)} />
                      {errors.username && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4"><FaExclamationCircle className="h-5 w-5 text-red-500" /></div>}
                    </div>
                    {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-full">
                    <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative rounded-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><FaEnvelope className="h-5 w-5 text-gray-400" /></div>
                      <input type="email" id="email" placeholder="email@example.com" {...register('email', { required: 'Vui lòng nhập email', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email không hợp lệ' } })} className={inputBaseClasses(!!errors.email)} />
                      {errors.email && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4"><FaExclamationCircle className="h-5 w-5 text-red-500" /></div>}
                    </div>
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Bảo mật */}
              <div className="px-6 py-8 sm:p-10 border-t border-gray-200">
                <div className="pb-6 border-b border-gray-200">
                  <h2 className="text-xl leading-7 font-semibold text-gray-900">
                    Bảo mật
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">Để trống nếu bạn không muốn thay đổi mật khẩu.</p>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                  {/* Mật khẩu mới */}
                  <div className="sm:col-span-3">
                    <label htmlFor="newPassword" className="block text-base font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                    <div className="relative rounded-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><FaKey className="h-5 w-5 text-gray-400" /></div>
                      <input type={showPassword ? "text" : "password"} id="newPassword" {...register('newPassword', { minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' } })} className={inputBaseClasses(!!errors.newPassword)} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>}
                  </div>

                  {/* Xác nhận mật khẩu mới */}
                  <div className="sm:col-span-3">
                    <label htmlFor="confirmNewPassword" className="block text-base font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                    <div className="relative rounded-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><FaKey className="h-5 w-5 text-gray-400" /></div>
                      <input type={showConfirmPassword ? "text" : "password"} id="confirmNewPassword" {...register('confirmNewPassword', { validate: value => value === newPasswordValue || 'Mật khẩu xác nhận không khớp' })} className={inputBaseClasses(!!errors.confirmNewPassword)} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmNewPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmNewPassword.message}</p>}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-6 py-5 sm:px-10 bg-gray-50 border-t border-gray-200 text-right">
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className={`inline-flex items-center justify-center rounded-lg border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out
                  ${isSubmitting || !isDirty
                      ? 'bg-indigo-400 cursor-not-allowed hover:bg-indigo-400'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 active:bg-indigo-800 transform hover:scale-105 active:scale-100'
                    }`}
                >
                  {isSubmitting ? <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" /> : <FaSave className="-ml-1 mr-2 h-5 w-5" />}
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileForm;