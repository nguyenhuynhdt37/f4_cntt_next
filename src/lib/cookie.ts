import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const getCookieString = async () => {
    const cookieStore = await cookies();
    return cookieStore
        .getAll()
        .map(({ name, value }: { name: string; value: string }) => `${name}=${value}`)
        .join('; ');
};

// Kiểm tra cookie authentication và redirect nếu đã tồn tại
export const checkAuthCookieAndRedirect = async (redirectPath: string = '/') => {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('jwt'); // Tên của cookie xác thực

    if (authCookie) {
        // Nếu cookie tồn tại, redirect đến trang được chỉ định
        redirect(redirectPath);
    }

    // Nếu không có cookie, tiếp tục hiển thị trang hiện tại
    return null;
};