import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Github, ExternalLink, User, Edit, Trash2 } from 'lucide-react';
import { useProject, useDeleteProject } from '../hooks/useProjects';
import { useGetMe } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CommentSection from '../components/comments/CommentSection';
import { formatDate } from '../utils/helpers';
import { STATUS_COLORS } from '../utils/constants';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(id);
  const { data: user } = useGetMe();
  const { mutate: deleteProject } = useDeleteProject();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id, {
        onSuccess: () => {
          navigate('/');
        },
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!project) {
    return <ErrorMessage message="Project not found" />;
  }

  const isOwner = user && project.author && user._id === project.author._id;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[project.status]}`}>
                  {project.status.replace('-', ' ')}
                </span>
                {project.lookingForCollaborators && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Looking for collaborators
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>
            </div>
            {isOwner && (
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button onClick={handleDelete} className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3 mb-6 pb-6 border-b">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{project.author.name}</p>
              <p className="text-sm text-gray-600">{project.author.email}</p>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(project.createdAt)}</span>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{project.description}</p>
          </div>
          {project.techStack && project.techStack.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span key={index} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(project.githubUrl || project.liveUrl) && (
            <div className="flex flex-wrap gap-4">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Github className="w-5 h-5" />
                  <span>View Code</span>
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          )}
        </div>
        <CommentSection projectId={id} />
      </div>
    </div>
  );
}

export default ProjectDetails;