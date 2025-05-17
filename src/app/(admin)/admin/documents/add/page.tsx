import AddDocumentForm from "@/components/admin/documents/AddDocumentForm";

export const metadata = {
    title: 'Thêm Tài liệu Mới - Admin',
    description: 'Thêm tài liệu mới vào hệ thống thư viện số',
};

export default function AddDocumentPage() {
    return (
        <AddDocumentForm />
    );
}
