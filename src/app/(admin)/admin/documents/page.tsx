import DocumentsList from "@/components/admin/documents/DocumentsList";

export const metadata = {
    title: 'Quản lý Tài liệu - Admin',
    description: 'Quản lý tài liệu trong hệ thống thư viện số',
};

export default function DocumentsPage() {
    return (
        <DocumentsList />
    );
}
