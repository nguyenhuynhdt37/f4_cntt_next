import { Metadata } from 'next';
import RegisterForm from '@/components/shared/register';
import { checkAuthCookieAndRedirect } from '@/lib/cookie';

export const metadata: Metadata = {
    title: 'Đăng ký | SenseLib - Tri thức cho cộng đồng',
    description: 'Tạo tài khoản mới để truy cập vào kho tài liệu học tập của SenseLib',
};

export default async function RegisterPage() {
    // Kiểm tra cookie, nếu đã đăng nhập thì chuyển hướng về trang chủ
    await checkAuthCookieAndRedirect('/');

    return <RegisterForm />;
} 