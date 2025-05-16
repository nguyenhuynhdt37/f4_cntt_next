import LoginForm from '@/components/shared/login';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Đăng nhập - F8 Thư Viện Học Tập',
    description: 'Đăng nhập vào thư viện tài liệu học tập F8 để truy cập hàng ngàn tài liệu chất lượng',
};

export default function LoginPage() {
    return <LoginForm />;
}