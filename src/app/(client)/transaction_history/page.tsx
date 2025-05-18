'use client';

import React from 'react';
import TransactionList from '@/components/client/transaction_history/TransactionList';

export default function TransactionHistoryPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <TransactionList />
            </div>
        </div>
    );
}