import EditAuthorForm from '@/components/admin/authors/EditAuthorForm';

export default function EditAuthorPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto p-4">
            <EditAuthorForm id={params.id} />
        </div>
    );
}
