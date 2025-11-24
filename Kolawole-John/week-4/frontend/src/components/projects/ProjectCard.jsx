import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, User } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="card hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status]}`}>
          {project.status.replace('-', ' ')}
        </span>
        {project.lookingForCollaborators && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Looking for collaborators
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {project.title}
      </h3>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {project.description}
      </p>

      {project.techStack && project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
              +{project.techStack.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <span className="text-sm text-gray-600">{project.author?.name}</span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{project.commentCount || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatRelativeTime(project.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}