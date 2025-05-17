import React from 'react';
import DocumentView from '@/components/admin/documents/DocumentView';

interface Params {
    id: string;
}

interface ViewDocumentPageProps {
    params: Params;
}

export default function ViewDocumentPage({ params }: ViewDocumentPageProps) {
    // Using React.use() to unwrap params as it will be a Promise in future Next.js versions
    const unwrappedParams = React.use(Promise.resolve(params));
    const id = unwrappedParams.id;

    return <DocumentView id={id} />;
}
