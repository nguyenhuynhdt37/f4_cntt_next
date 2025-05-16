import BooksManagementClient from '@/components/admin/library/BooksManagementClient';

export const metadata = {
    title: 'Quản lý sách - F8 Admin',
    description: 'Quản lý sách trong thư viện F8',
};

export default function BooksManagementPage() {
    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <BooksManagementClient />
            </div>
        </div>
    );
}
