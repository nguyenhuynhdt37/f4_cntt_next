"use client";

import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search } from "lucide-react";

interface DocumentSearchProps {
  onSearch: (query: string) => void;
}

export default function DocumentSearch({ onSearch }: DocumentSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="mb-2">
      <h3 className="text-lg font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
        Tìm kiếm tài liệu
      </h3>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Nhập từ khóa..."
          className="pr-10 focus-visible:ring-indigo-500 bg-gray-50 dark:bg-gray-700"          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-0 top-0 h-full rounded-l-none bg-indigo-600 hover:bg-indigo-700"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
