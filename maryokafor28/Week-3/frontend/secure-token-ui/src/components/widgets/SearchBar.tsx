"use client";
import { Search, Filter } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  onFilterClick?: () => void; // optional filter button handler
}

export default function SearchBar({
  value,
  onChange,
  onFilterClick,
}: SearchBarProps) {
  return (
    <div className="flex items-center w-full mb-4 gap-2">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700"
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={onFilterClick}
        className="p-3 bg-gray-100 border border-gray-200 rounded-2xl hover:bg-gray-200 transition"
        title="Filter tasks"
      >
        <Filter className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
