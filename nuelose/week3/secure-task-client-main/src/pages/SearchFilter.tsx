import { CiSearch, CiFilter } from "react-icons/ci";
import { useState } from "react";
import type { AxiosError } from "axios";
import { useApi } from "../services/api";

interface Task {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

function SearchFilter() {
  const api = useApi()
  const [keyword, setKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState<Task[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (keyword) {
        response = await api.post("/tasks/search", { keyword });
      } else if (fromDate || toDate) {
        response = await api.post("/tasks/filter", { fromDate, toDate });
      } else {
        setError("Provide keyword or dates");
        return;
      }
      setResults(response.data.results || response.data);
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || "Login failed");
    }
  };

  const handleReset = () => {
    setKeyword("");
    setFromDate("");
    setToDate("");
    setResults([]);
    setError("");
  };

  return (
    <div className="p-4">
      <h2>Search & Filter Tasks</h2>
      <p>Find tasks using keywords and date ranges</p>
      {error && <p className="text-red-500">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="border border-slate-400 max-w-4xl px-4 py-8 rounded-xl space-y-4"
      >
        <div className="flex flex-col">
          <label>Search by Title or Description</label>
          <div className="bg-slate-200 flex items-center px-2 rounded-lg">
            <CiSearch />
            <input
              className="w-full focus:outline-none bg-transparent p-2"
              type="text"
              placeholder="Enter Keywords..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label>From Date</label>
          <div className="bg-slate-200 flex items-center pr-5 rounded-lg">
            <input
              className="w-full focus:outline-none bg-transparent p-2"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label>To Date</label>
          <div className="bg-slate-200 flex items-center pr-5 rounded-lg">
            <input
              className="w-full focus:outline-none bg-transparent p-2"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
           
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-slate-500 w-2/3 text-white px-2 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <CiFilter /> Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="border w-1/3 border-slate-300 rounded-md px-2 py-2"
          >
            Reset
          </button>
        </div>
      </form>
      {results.length > 0 && (
        <div className="mt-4">
          <h3>Results:</h3>
          <ul>
            {results.map((task) => (
              <li key={task._id} className="border-b py-2">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
