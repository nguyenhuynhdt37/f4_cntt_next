import React from 'react';
import UsersList from '@/components/admin/users/UsersList';

export default function UsersPage() {
    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <UsersList />
        </div>
    );
}