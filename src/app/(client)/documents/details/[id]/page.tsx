"use client";

import { useState, useEffect } from "react";
import DocumentDetailHeader from "@/components/client/documents/details/DocumentDetailHeader";
import PDFPreview from "@/components/client/documents/details/PDFPreview";
import DocumentInfo from "@/components/client/documents/details/DocumentInfo";
import RelatedDocuments from "@/components/client/documents/details/RelatedDocuments";
import DocumentComments from "@/components/client/documents/details/DocumentComments";
import Link from "next/link";

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
      let mockDocument;

      // Dựa vào ID để tạo các loại tài liệu khác nhau để demo
      if (params.id === "1") {
        // Tài liệu miễn phí
        mockDocument = {
          id: "1",
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
          pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
          isPremium: false,
          score: 0 // Miễn phí tải liệu
        };
      } else if (params.id === "2") {
        // Tài liệu premium với 10 điểm
        mockDocument = {
          id: "2",
          title: "Hướng dẫn sử dụng React chuyên sâu",
          description: "Tài liệu chuyên sâu về React, bao gồm các kỹ thuật nâng cao để xây dựng ứng dụng web hiện đại, hiệu năng cao.",
          category: "Web Development",
          tags: ["React", "JavaScript", "Frontend", "Web"],
          downloadCount: 3120,
          uploadDate: "2024-01-10",
          fileSize: "2.8MB",
          fileType: "pdf",
          author: "ThS. Trần Thị B",
          pageCount: 85,
          estimatedReadTime: "3 giờ đọc",
          color: "bg-gradient-to-r from-purple-500 to-pink-400",
          language: "Tiếng Việt",
          publisher: "NXB Công nghệ",
          publicationDate: "2023-11-15",
          isbn: "978-604-XX-XXXX-Y",
          pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
          isPremium: true,
          score: 10 // Cần 10 điểm để tải
        };
      } else if (params.id === "3") {
        // Tài liệu premium với 50 điểm
        mockDocument = {
          id: "3",
          title: "Cơ sở dữ liệu nâng cao và tối ưu hóa",
          description: "Tài liệu về các kỹ thuật tối ưu và thiết kế CSDL, phân tích hiệu năng và xử lý dữ liệu lớn.",
          category: "Cơ sở dữ liệu",
          tags: ["Database", "SQL", "NoSQL", "Optimization"],
          downloadCount: 1870,
          uploadDate: "2023-11-20",
          fileSize: "4.2MB",
          fileType: "pdf",
          author: "PGS.TS Lê Văn C",
          pageCount: 150,
          estimatedReadTime: "5 giờ đọc",
          color: "bg-gradient-to-r from-green-500 to-emerald-400",
          language: "Tiếng Việt",
          publisher: "NXB ĐHQG Hà Nội",
          publicationDate: "2023-06-15",
          isbn: "978-604-XX-XXXX-Z",
          pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
          isPremium: true,
          score: 50 // Cần 50 điểm để tải
        };
      } else {
        // Mặc định nếu ID không khớp
        mockDocument = {
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
          isbn: "978-604-XX-XXXX-X", pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
          isPremium: false,
          score: 0
        }
      }

      const mockRelatedDocuments = [
        {
          id: "1",
          title: "Giáo trình Lập trình C++",
          description: "Tài liệu miễn phí về lập trình C++",
          category: "Lập trình",
          downloadCount: 1500,
          uploadDate: "2023-10-15",
          fileSize: "3.2MB",
          fileType: "pdf",
          author: "TS. Nguyễn Văn A",
          thumbnailUrl: "/images/documents/react-book.jpg",
          color: "bg-gradient-to-r from-blue-500 to-cyan-400",
          isPremium: false,
          score: 0
        },
        {
          id: "2",
          title: "Hướng dẫn sử dụng React",
          description: "Tài liệu premium về React framework",
          category: "Web Development",
          downloadCount: 3120,
          uploadDate: "2024-01-10",
          fileSize: "2.8MB",
          fileType: "pdf",
          author: "ThS. Trần Thị B",
          thumbnailUrl: "/images/documents/react-book.jpg",
          color: "bg-gradient-to-r from-purple-500 to-pink-400",
          isPremium: true,
          score: 10
        },
        {
          id: "3",
          title: "Cơ sở dữ liệu nâng cao",
          description: "Tài liệu premium về tối ưu CSDL",
          category: "Cơ sở dữ liệu",
          downloadCount: 1870,
          uploadDate: "2023-11-20",
          fileSize: "4.2MB",
          fileType: "pdf",
          author: "PGS.TS Lê Văn C",
          thumbnailUrl: "/images/documents/database-book.jpg",
          color: "bg-gradient-to-r from-green-500 to-emerald-400",
          isPremium: true,
          score: 50
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

      <div className="mb-8 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 text-sm">
          👋 Đây là trang <strong>demo</strong> cho chức năng tải xuống tài liệu premium.
          <Link href="/demo-points" className="text-blue-800 underline ml-2">
            Quản lý điểm người dùng tại đây
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <PDFPreview
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
