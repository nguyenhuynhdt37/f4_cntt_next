import EditSlideForm from '@/components/admin/slides/EditSlideForm';

interface EditSlidePageProps {
    params: { id: string };
}

export default function EditSlidePage({ params }: EditSlidePageProps) {
    const slideId = parseInt(params.id);

    return (
        <div className="p-6">
            <EditSlideForm slideId={slideId} />
        </div>
    );
}
