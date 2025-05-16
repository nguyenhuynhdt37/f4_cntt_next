import type { Metadata } from 'next';
import '../globals.css';
import { Lexend } from 'next/font/google';
import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';

export const metadata: Metadata = {
    title: 'F8 Admin Dashboard',
    description: 'Admin Dashboard for F8 Education Platform',
    icons: 'https://fullstack.edu.vn/favicon/favicon_32x32.png',
};
const lexend = Lexend({
    subsets: ['latin', 'vietnamese'],
    weight: ['100', '200', '300', '400', '500', '600', '700'],
    display: 'swap',
});
export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();

    return (

        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <AdminHeader />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>

    );
}
