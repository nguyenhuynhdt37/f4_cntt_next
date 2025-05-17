import EditPublisherForm from '@/components/admin/publishers/EditPublisherForm';

export default function EditPublisherPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto p-4">
            <EditPublisherForm id={params.id} />
        </div>
    );
}
