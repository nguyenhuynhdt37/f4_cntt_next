import UsersManagementClient from '@/components/admin/library/UsersManagementClient';

export const metadata = {
    title: 'Quản lý người dùng thư viện - F8 Admin',
    description: 'Quản lý người dùng có quyền mượn sách trong thư viện F8',
};

export default function UsersManagementPage() {
    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <UsersManagementClient />
            </div>
        </div>
    );
}
