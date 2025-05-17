"use client";

import { useState } from "react";
import DocumentSearch from "@/components/client/documents/DocumentSearch";
import DocumentFilter from "@/components/client/documents/DocumentFilter";
import DocumentList from "@/components/client/documents/DocumentList";
import DocumentGrid from "@/components/client/documents/DocumentGrid";
import { Button } from "../../../components/ui/button";
import { GridIcon, ListIcon } from "lucide-react";

export default function DocumentsPage() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: "all",
    sortBy: "newest",
  });

  // Mock data - replace with actual API call
  const documents = [
    {
      id: "1",
      title: "Giáo trình Lập trình C++",
      description: "Giáo trình cơ bản về ngôn ngữ C++ cho sinh viên năm nhất",
      category: "Lập trình",
      downloadCount: 1250,
      uploadDate: "2023-08-15",
      fileSize: "3.5MB",
      fileType: "pdf",
      author: "TS. Nguyễn Văn A",
      thumbnailUrl: "/images/documents/cpp-book.jpg",
      color: "bg-gradient-to-r from-blue-500 to-cyan-400",
    },
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
    
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic
  };

  const handleFilterChange = (filters: any) => {
    setSelectedFilters(filters);
    // Implement filtering logic
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 md:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Tài liệu học tập
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant={viewType === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("grid")}
            className={viewType === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <GridIcon className="h-4 w-4 mr-2" /> Lưới
          </Button>
          <Button
            variant={viewType === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("list")}
            className={viewType === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <ListIcon className="h-4 w-4 mr-2" /> Danh sách
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <DocumentSearch onSearch={handleSearch} />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <DocumentFilter onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/4">
          {viewType === "grid" ? (
            <DocumentGrid documents={documents} />
          ) : (
            <DocumentList documents={documents} />
          )}
        </div>
      </div>
    </div>
  );
}