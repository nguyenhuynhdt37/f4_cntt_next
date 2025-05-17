'use client';

import React from 'react';
import ChangePasswordForm from '@/components/client/change_password/ChangePasswordForm';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function ChangePasswordPage() {
    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">                <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <FaArrowLeft className="mr-2" />
                <span>Quay lại</span>
            </Link>
            </div>
            <ChangePasswordForm />
        </div>
    );
}