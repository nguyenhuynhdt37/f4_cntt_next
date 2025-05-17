import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { updateProfile } from '@/api/axios/user'; // Đảm bảo đường dẫn này chính xác
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface UserData {
  id?: string | number;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role?: string;
}

const ProfileForm = ({ userData }: { userData: UserData | null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
    }
  });

  useEffect(() => {
    if (userData) {
      const newValues = {
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      };
      reset(newValues, { keepDirty: false });
    }
  }, [userData, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      toast.success('Cập nhật thông tin thành công!');
      reset(data, { keepDirty: false });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClasses = (hasError: boolean) =>
    `appearance-none block w-full bg-white text-gray-800 placeholder-gray-400 border ${ // text-gray-700 -> text-gray-800
    hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500'
    } rounded-lg py-3 px-4 pl-12 text-base leading-tight focus:outline-none focus:bg-white focus:ring-1 transition-colors duration-150 ease-in-out`; // sm:text-base, pl-11 -> pl-12

  const textareaBaseClasses = (hasError: boolean) =>
    `appearance-none block w-full bg-white text-gray-800 placeholder-gray-400 border ${ // text-gray-700 -> text-gray-800
    hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500'
    } rounded-lg py-3 px-4 pl-12 text-base leading-tight focus:outline-none focus:bg-white focus:ring-1 transition-colors duration-150 ease-in-out resize-y`; // sm:text-base, pl-11 -> pl-12

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100"> {/* Nền gradient nhẹ hơn một chút */}
      {/* Header Section */}
      <div className="bg-indigo-600 pb-32 pt-10 sm:pt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white"> {/* text-3xl -> text-4xl */}
                Hồ sơ cá nhân
              </h1>
              <p className="mt-2 text-base text-indigo-200"> {/* text-sm -> text-base */}
                Xem và chỉnh sửa thông tin cá nhân của bạn.
              </p>
            </div>
            {/* Optional: User Avatar */}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Personal Information Section */}
              <div className="px-6 py-8 sm:p-10">
                <div className="pb-6 border-b border-gray-200">
                  <h2 className="text-xl leading-7 font-semibold text-gray-900"> {/* text-lg -> text-xl */}
                    Thông tin liên hệ
                  </h2>
                  <p className="mt-1 text-sm text-gray-600"> {/* Giữ text-sm hoặc text-base */}
                    Chi tiết này sẽ được sử dụng cho việc liên lạc và xác minh tài khoản.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6"> {/* gap-y-6 -> gap-y-8 */}
                  {/* Full Name */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="fullName"
                      className="block text-base font-medium text-gray-700 mb-2" /* text-sm -> text-base, mb-1.5 -> mb-2 */
                    >
                      Họ và tên
                    </label>
                    <div className="relative rounded-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"> {/* pl-3.5 -> pl-4 */}
                        <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        placeholder="Nguyễn Văn A"
                        {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
                        className={inputBaseClasses(!!errors.fullName)}
                      />
                      {errors.fullName && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4"> {/* pr-3.5 -> pr-4 */}
                          <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    {errors.fullName && (
                      <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p> /* text-xs -> text-sm, mt-1.5 -> mt-2 */
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-base font-medium text-gray-700 mb-2" /* text-sm -> text-base, mb-1.5 -> mb-2 */
                    >
                      Email
                    </label>
                    <div className="relative rounded-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"> {/* pl-3.5 -> pl-4 */}
                        <FaEnvelope className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        placeholder="email@example.com"
                        {...register('email', {
                          required: 'Vui lòng nhập email',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email không hợp lệ',
                          },
                        })}
                        className={inputBaseClasses(!!errors.email)}
                      />
                      {errors.email && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4"> {/* pr-3.5 -> pr-4 */}
                          <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> /* text-xs -> text-sm, mt-1.5 -> mt-2 */
                    )}
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phone"
                      className="block text-base font-medium text-gray-700 mb-2" /* text-sm -> text-base, mb-1.5 -> mb-2 */
                    >
                      Số điện thoại
                    </label>
                    <div className="relative rounded-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"> {/* pl-3.5 -> pl-4 */}
                        <FaPhone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        placeholder="09xxxxxxxx"
                        {...register('phone', {
                          required: 'Vui lòng nhập số điện thoại',
                          pattern: {
                            value: /^(0[3|5|7|8|9])+([0-9]{8})\b/,
                            message: 'Số điện thoại không hợp lệ',
                          },
                        })}
                        className={inputBaseClasses(!!errors.phone)}
                      />
                      {errors.phone && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4"> {/* pr-3.5 -> pr-4 */}
                          <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p> /* text-xs -> text-sm, mt-1.5 -> mt-2 */
                    )}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-full">
                    <label
                      htmlFor="address"
                      className="block text-base font-medium text-gray-700 mb-2" /* text-sm -> text-base, mb-1.5 -> mb-2 */
                    >
                      Địa chỉ
                    </label>
                    <div className="relative rounded-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-start pt-[15px] pl-4"> {/* pt-3.5 -> pt-[15px], pl-3.5 -> pl-4 */}
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <textarea
                        id="address"
                        rows={4}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        {...register('address', { required: 'Vui lòng nhập địa chỉ' })}
                        className={textareaBaseClasses(!!errors.address)}
                      />
                      {errors.address && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-start pt-[15px] pr-4"> {/* pt-3.5 -> pt-[15px], pr-3.5 -> pr-4 */}
                          <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    {errors.address && (
                      <p className="mt-2 text-sm text-red-600">{errors.address.message}</p> /* text-xs -> text-sm, mt-1.5 -> mt-2 */
                    )}
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
                      ? 'bg-indigo-400 cursor-not-allowed hover:bg-indigo-400' // Disabled state màu sáng hơn
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 active:bg-indigo-800 transform hover:scale-105 active:scale-100'
                    }`}
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  ) : (
                    <FaSave className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  )}
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer (Optional) */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-base text-gray-500">© {new Date().getFullYear()} Tên Công Ty Của Bạn. Bảo lưu mọi quyền.</p> {/* text-sm -> text-base */}
      </footer>
    </div>
  );
};

export default ProfileForm;