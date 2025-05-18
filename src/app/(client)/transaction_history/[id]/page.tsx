'use client';

import React from 'react';
import TransactionDetailView from '@/components/client/transaction_history/TransactionDetailView';

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <TransactionDetailView id={params.id} />
            </div>
        </div>
    );
}
