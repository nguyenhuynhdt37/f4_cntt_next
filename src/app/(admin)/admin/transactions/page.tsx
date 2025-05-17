'use client';

import React, { useState } from 'react';
import TransactionsList from '@/components/admin/transactions/TransactionsList';
import TransactionStatistics from '@/components/admin/transactions/TransactionStatistics';
import { TabGroup } from '@headlessui/react';
import { ChartBarSquareIcon, ListBulletIcon } from '@heroicons/react/24/outline';

const TransactionsPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Lịch sử giao dịch</h1>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <div className="px-4 sm:px-6">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab(0)}
                                className={`border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 0
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } flex items-center mr-8`}
                            >
                                <ListBulletIcon className="h-5 w-5 mr-2" />
                                Danh sách giao dịch
                            </button>
                            <button
                                onClick={() => setActiveTab(1)}
                                className={`border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 1
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } flex items-center`}
                            >
                                <ChartBarSquareIcon className="h-5 w-5 mr-2" />
                                Thống kê
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Tab content */}
            <div>
                {activeTab === 0 && <TransactionsList />}
                {activeTab === 1 && <TransactionStatistics />}
            </div>
        </div>
    );
};

export default TransactionsPage;
