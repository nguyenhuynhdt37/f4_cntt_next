import React from 'react';
import TransactionDetailView from '@/components/admin/transactions/TransactionDetailView';

export const metadata = {
    title: 'Chi tiết giao dịch | Admin Dashboard',
    description: 'Xem chi tiết thông tin giao dịch trên hệ thống',
};

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
    return <TransactionDetailView id={params.id} />;
} 
