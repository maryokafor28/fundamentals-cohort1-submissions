import React from 'react';
import { PROJECT_STATUS } from '../../utils/constants';

export default function ProjectFilters({ filters, setFilters }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field py-2"
          >
            <option value="">All Status</option>
            <option value={PROJECT_STATUS.IDEA}>Idea</option>
            <option value={PROJECT_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={PROJECT_STATUS.COMPLETED}>Completed</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search projects..."
            className="input-field"
          />
        </div>

        {(filters.status || filters.search) && (
          <button
            onClick={() => setFilters({})}
            className="btn-secondary mt-6"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}