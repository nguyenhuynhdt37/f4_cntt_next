import React from 'react';
import EditUserForm from '@/components/admin/users/EditUserForm';

export default function EditUserPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto py-6">
            <EditUserForm id={params.id} />
        </div>
    );
}
