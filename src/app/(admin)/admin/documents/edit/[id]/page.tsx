import EditDocumentForm from "@/components/admin/documents/EditDocumentForm";

export const metadata = {
    title: 'Chỉnh sửa Tài liệu - Admin',
    description: 'Chỉnh sửa thông tin tài liệu trong hệ thống thư viện số',
};

interface EditDocumentPageProps {
    params: {
        id: string;
    };
}

export default function EditDocumentPage({ params }: EditDocumentPageProps) {
    return (
        <EditDocumentForm id={params.id} />
    );
}
