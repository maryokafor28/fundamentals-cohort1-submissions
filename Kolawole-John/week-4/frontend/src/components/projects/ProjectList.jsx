import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import ProjectCard from './ProjectCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectList({ filters = {} }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useProjects(page, filters);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} retry={refetch} />;
  }

  const { projects, pagination } = data;

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No projects found</p>
        <p className="text-gray-500 mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}