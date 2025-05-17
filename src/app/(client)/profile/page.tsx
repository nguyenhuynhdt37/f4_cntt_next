'use client';

import { useEffect, useState } from 'react';
import ProfileForm from '@/components/client/profile/ProfileForm';
import { getCurrentUser } from '@/api/axios/user';
import { FaUser, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu cho userData
interface UserData {
  id?: string | number;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role?: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header with Avatar */}
        {/* <div className="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-8 shadow-lg">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-2 shadow-inner">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <FaUser className="h-12 w-12 text-blue-600" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white">{userData?.fullName || 'Người dùng'}</h1>
              <p className="mt-1 text-blue-100">{userData?.email}</p>
            </div>
          </div>
        </div>    */}        {/* Back Button */}        <div className="mb-6">          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          <span>Quay lại</span>
        </Link>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`mr-2 inline-block rounded-t-lg border-b-2 px-5 py-2.5 text-center ${activeTab === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600'
              }`}
          >
            <div className="flex items-center space-x-2">
              <FaUser className="h-4 w-4" />
              <span>Thông tin cá nhân</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`mr-2 inline-block rounded-t-lg border-b-2 px-5 py-2.5 text-center ${activeTab === 'documents'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600'
              }`}
          >
            <div className="flex items-center space-x-2">
              <FaFileAlt className="h-4 w-4" />
              <span>Tài liệu của tôi</span>
            </div>
          </button>
        </div>

        {/* Content Container */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          {activeTab === 'profile' && (
            <div className="p-6">
              <ProfileForm userData={userData} />
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="p-6">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <h3 className="text-lg font-medium text-blue-700">Tài liệu của tôi</h3>
                <p className="mt-2 text-blue-600">Chức năng này đang được phát triển.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}