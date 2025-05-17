import React from 'react';
import TransactionsList from '@/components/admin/transactions/TransactionsList';

export const metadata = {
    title: 'Danh sách giao dịch | Admin Dashboard',
    description: 'Quản lý và theo dõi tất cả giao dịch thanh toán trên hệ thống',
};

export default function TransactionsPage() {
    return <TransactionsList />;
} 