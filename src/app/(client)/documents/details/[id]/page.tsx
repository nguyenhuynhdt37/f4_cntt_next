"use client";

import { useState, useEffect } from "react";
import DocumentDetailHeader from "@/components/client/documents/details/DocumentDetailHeader";
import PDFPreview from "@/components/client/documents/details/PDFPreview";
import DocumentInfo from "@/components/client/documents/details/DocumentInfo";
import RelatedDocuments from "@/components/client/documents/details/RelatedDocuments";
import DocumentComments from "@/components/client/documents/details/DocumentComments";

interface PageProps {
  params: {
    id: string;
  };
}

export default function DocumentDetailPage({ params }: PageProps) {
  // Trong môi trường thực tế, bạn sẽ fetching dữ liệu từ backend
  const [document, setDocument] = useState<any>(null);
  const [relatedDocuments, setRelatedDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetching dữ liệu
    setTimeout(() => {
      // Giả định dữ liệu
      const mockDocument = {
        id: params.id,
        title: "Giáo trình Lập trình hướng đối tượng với C++",
        description: "Tài liệu chi tiết về lập trình hướng đối tượng với C++, cung cấp kiến thức từ cơ bản đến nâng cao cho sinh viên CNTT. Bao gồm đầy đủ các khái niệm về lớp, đối tượng, kế thừa, đa hình, trừu tượng và đóng gói, kèm theo nhiều ví dụ thực tế và bài tập thực hành.",
        category: "Lập trình",
        tags: ["C++", "OOP", "Lập trình", "Hướng đối tượng", "CNTT"],
        downloadCount: 1250,
        uploadDate: "2023-08-15",
        fileSize: "3.5MB",
        fileType: "pdf",
        author: "TS. Nguyễn Văn A",
        pageCount: 120,
        estimatedReadTime: "4 giờ đọc",
        color: "bg-gradient-to-r from-blue-500 to-cyan-400",
        language: "Tiếng Việt",
        publisher: "NXB Giáo dục",
        publicationDate: "2022-05-20",
        isbn: "978-604-XX-XXXX-X",
        pdfUrl: "https://www.africau.edu/images/default/sample.pdf", // URL mẫu cho PDF
      };

      const mockRelatedDocuments = [
        {
          id: "2",
          title: "Hướng dẫn sử dụng React",
          description: "Tài liệu hướng dẫn React từ cơ bản đến nâng cao",
          category: "Web Development",
          downloadCount: 3120,
          uploadDate: "2024-01-10",
          fileSize: "2.8MB",
          fileType: "pdf",
          author: "ThS. Trần Thị B",
          thumbnailUrl: "/images/documents/react-book.jpg",
          color: "bg-gradient-to-r from-purple-500 to-pink-400",
        },
        {
          id: "3",
          title: "Cơ sở dữ liệu nâng cao",
          description: "Tài liệu về các kỹ thuật tối ưu và thiết kế CSDL",
          category: "Cơ sở dữ liệu",
          downloadCount: 1870,
          uploadDate: "2023-11-20",
          fileSize: "4.2MB",
          fileType: "pdf",
          author: "PGS.TS Lê Văn C",
          thumbnailUrl: "/images/documents/database-book.jpg",
          color: "bg-gradient-to-r from-green-500 to-emerald-400",
        },
        {
          id: "4",
          title: "Trí tuệ nhân tạo cơ bản",
          description: "Nhập môn về AI và Machine Learning",
          category: "Trí tuệ nhân tạo",
          downloadCount: 2450,
          uploadDate: "2024-02-05",
          fileSize: "5.1MB",
          fileType: "pdf",
          author: "GS.TS Phạm Thị D",
          thumbnailUrl: "/images/documents/ai-book.jpg",
          color: "bg-gradient-to-r from-red-500 to-orange-400",
        },
      ];

      setDocument(mockDocument);
      setRelatedDocuments(mockRelatedDocuments);
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Không tìm thấy tài liệu</h2>
          <p className="text-red-600 dark:text-red-300">Tài liệu bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DocumentDetailHeader document={document} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">          <PDFPreview 
            pdfUrl={document.pdfUrl} 
            previewPages={3} // Chỉ cho phép xem 3 trang
            totalPages={document.pageCount} 
            documentId={document.id}
          />
        </div>
        <div className="lg:col-span-1">
          <DocumentInfo document={document} />
        </div>
      </div>
        <RelatedDocuments documents={relatedDocuments} />
      
      <div className="mt-8">
        <DocumentComments documentId={document.id} />
      </div>
    </div>
  );
}
