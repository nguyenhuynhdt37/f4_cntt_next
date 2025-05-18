'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import Cookies from 'js-cookie';
import { getProfile } from '@/api/axios/auth';
import { log } from 'node:console';
import { logOutUser } from '@/api/axios/user';
import { saveProfile } from '@/redux/slices/authSlice';
import { parse } from 'cookie';
export default function AuthChecker({ children, cookieString }: { children: React.ReactNode, cookieString: string }) {
    const router = useRouter();
    const parsed = cookieString ? parse(cookieString) : {};

    // 2. Lấy token từ cookie bạn cần, ví dụ tên 'F4CNTT'
    const token = parsed['F4CNTT'];

    const dispatch = useAppDispatch();
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const res = await getProfile();
                dispatch(saveProfile(res));
            } catch (error) {
                await logOutUser();
                throw new Error('Lỗi xác thực người dùng');
            }
        };
        if (token) {
            verifyAuth();
        }
    }, [token]);



    return <>{children}</>;
} 