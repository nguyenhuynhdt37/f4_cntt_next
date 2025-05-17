import EditCategoryForm from '@/components/admin/categories/EditCategoryForm';

export default function EditCategory({ params }: { params: { id: string } }) {
    return (
        <div className="p-6">
            <EditCategoryForm id={params.id} />
        </div>
    );
}
