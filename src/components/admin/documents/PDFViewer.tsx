// components/Viewer.tsx
'use client';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

export default function PDFViewer({ url }: { url: string }) {
    const layoutPlugin = defaultLayoutPlugin();
    return (
        <Worker
            // jsDelivr cho worker, version phải trùng 2.16.105
            workerUrl="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js"
        >
            <div style={{ height: '100vh' }}>
                <Viewer fileUrl={url} plugins={[layoutPlugin]} />
            </div>
        </Worker>
    );
}
