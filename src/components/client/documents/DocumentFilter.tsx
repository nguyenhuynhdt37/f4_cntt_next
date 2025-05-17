"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";

interface DocumentFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function DocumentFilter({ onFilterChange }: DocumentFilterProps) {
  const [filters, setFilters] = useState({
    category: "all",
    sortBy: "newest",
    fileTypes: [] as string[],
  });

  const categories = [
    { id: "all", name: "Tất cả", color: "bg-gray-600" },
    { id: "programming", name: "Lập trình", color: "bg-blue-500" },
    { id: "web", name: "Web Development", color: "bg-purple-500" },
    { id: "database", name: "Cơ sở dữ liệu", color: "bg-green-500" },
    { id: "ai", name: "Trí tuệ nhân tạo", color: "bg-red-500" },
    { id: "network", name: "Mạng máy tính", color: "bg-orange-500" },
  ];

  const fileTypes = [
    { id: "pdf", name: "PDF", color: "bg-red-600" },
    { id: "doc", name: "DOC/DOCX", color: "bg-blue-600" },
    { id: "ppt", name: "PPT/PPTX", color: "bg-orange-600" },
    { id: "txt", name: "TXT", color: "bg-gray-600" },
    { id: "excel", name: "Excel", color: "bg-green-600" },
  ];

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleFileTypeChange = (fileType: string) => {
    setFilters((prev) => {
      const types = prev.fileTypes.includes(fileType)
        ? prev.fileTypes.filter((t) => t !== fileType)
        : [...prev.fileTypes, fileType];
      return { ...prev, fileTypes: types };
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
        Bộ lọc tài liệu
      </h3>
      
      <Accordion type="multiple" defaultValue={["category", "sort", "type"]}>
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-medium">
            Danh mục
          </AccordionTrigger>
          <AccordionContent>
            {/* <div className="flex flex-wrap gap-2 my-2">
              {categories.map((category) => (
                <Badge 
                  key={category.id}
                  className={`cursor-pointer ${filters.category === category.id ? 'bg-opacity-100' : 'bg-opacity-60'} ${category.color}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div> */}
            <Select
              value={filters.sortBy}
              onValueChange={handleSortChange}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="newest">Tất cả</SelectItem>
                  <SelectItem value="oldest">Lập trình</SelectItem>
                  <SelectItem value="many">Trí tuệ nhân tạo</SelectItem>
                  <SelectItem value="less">Mạng máy tính</SelectItem>
                  <SelectItem value="less">Web Development</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort">
          <AccordionTrigger className="text-sm font-medium">
            Sắp xếp theo
          </AccordionTrigger>
          <AccordionContent>
            <Select
              value={filters.sortBy}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="many">Tải nhiều nhất</SelectItem>
                  <SelectItem value="less">Tải ít nhất</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger className="text-sm font-medium">
            Loại file
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 mt-2">
              {fileTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={filters.fileTypes.includes(type.id)}
                    onCheckedChange={() => handleFileTypeChange(type.id)}
                  />
                  <Label
                    htmlFor={`type-${type.id}`}
                    className="cursor-pointer flex items-center"
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${type.color}`}></div>
                    {type.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
