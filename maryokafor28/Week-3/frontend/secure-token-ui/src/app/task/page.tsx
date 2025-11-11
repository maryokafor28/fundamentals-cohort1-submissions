"use client";

import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import SearchBar from "@/components/widgets/SearchBar";
import TaskList from "@/components/widgets/TaskList";
import { searchTasks, filterTasks } from "@/api/taskApi";
import { Task } from "@/types/task";
export default function Tasks() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // 🔍 Handle search with backend API
  const handleSearch = async (keyword: string, page = 1) => {
    if (!keyword.trim()) {
      setFilteredTasks([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await searchTasks({ keyword, page, limit: 10 });
      setFilteredTasks(response.tasks);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalResults(response.totalResults);
    } catch (error) {
      console.error(" Error searching tasks:", error);
      setFilteredTasks([]);
    }
  };

  // 🔍 Handle filtering by date range and status
  const handleFilter = async (page = 1) => {
    try {
      const filters: {
        page: number;
        limit: number;
        startDate?: string;
        endDate?: string;
        status?: string;
      } = { page, limit: 10 };
      const response = await filterTasks(filters);
      setFilteredTasks(response.tasks);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalResults(response.totalResults);
      setIsSearching(true);
      setShowFilters(false);
    } catch (error) {
      console.error("❌ Error filtering tasks:", error);
      setFilteredTasks([]);
    }
  };

  // Clear filters and search
  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatus("");
    setSearchQuery("");
    setFilteredTasks([]);
    setIsSearching(false);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalResults(0);
  };

  // Handle search input change with debounce-like behavior
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      handleSearch(query);
    } else {
      setFilteredTasks([]);
      setIsSearching(false);
    }
  };

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Search bar with filter button */}
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onFilterClick={() => setShowFilters((prev) => !prev)}
          />

          {/* 🧭 Date & Status Filter UI */}
          {showFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded-lg p-2 text-sm text-black"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded-lg p-2 text-sm text-black"
                  placeholder="End Date"
                />
                <button
                  onClick={() => handleFilter(1)}
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Active filters display */}
          {isSearching && (
            <div className="mt-3 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-800">
                {searchQuery && (
                  <span>
                    Searching for: <strong>{searchQuery}</strong>
                  </span>
                )}
                {(startDate || endDate || status) && (
                  <span className="ml-3">
                    Filters: {startDate && `From ${startDate}`}{" "}
                    {endDate && `To ${endDate}`} {status && `Status: ${status}`}
                  </span>
                )}
                <span className="ml-3 text-blue-600">
                  ({totalResults} result{totalResults !== 1 ? "s" : ""})
                </span>
              </div>
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-700 font-medium">
              {getCurrentDate()}
            </span>
          </div>
        </header>

        {/* Tasks Section */}
        <TaskList
          searchQuery=""
          filteredTasks={isSearching ? filteredTasks : undefined}
        />

        {/* Pagination */}
        {isSearching && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                const newPage = currentPage - 1;
                if (searchQuery) {
                  handleSearch(searchQuery, newPage);
                } else {
                  handleFilter(newPage);
                }
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                const newPage = currentPage + 1;
                if (searchQuery) {
                  handleSearch(searchQuery, newPage);
                } else {
                  handleFilter(newPage);
                }
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Logged in as <span className="font-medium">{user?.email}</span>
          <span
            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              user?.role === "admin"
                ? "bg-gray-200 text-gray-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {user?.role === "admin" ? "Admin" : "User"}
          </span>
        </div>
      </div>
    </div>
  );
}
