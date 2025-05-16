import BorrowManagementClient from '@/components/admin/library/BorrowManagementClient';

export const metadata = {
    title: 'Quản lý mượn/trả sách - F8 Admin',
    description: 'Quản lý giao dịch mượn/trả sách trong thư viện F8',
};

export default function BorrowManagementPage() {
    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <BorrowManagementClient />
            </div>
        </div>
    );
}
