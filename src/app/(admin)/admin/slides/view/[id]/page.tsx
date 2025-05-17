import ViewSlide from '@/components/admin/slides/ViewSlide';

interface ViewSlidePageProps {
    params: { id: string };
}

export default function ViewSlidePage({ params }: ViewSlidePageProps) {
    const slideId = parseInt(params.id);

    return (
        <div className="p-6">
            <ViewSlide slideId={slideId} />
        </div>
    );
}
