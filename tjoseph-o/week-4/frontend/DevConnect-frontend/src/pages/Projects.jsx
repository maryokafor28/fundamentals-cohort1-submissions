import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { FaGithub, FaExternalLinkAlt, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data.data);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
          <Link to="/projects/create" className="btn-primary">Create Project</Link>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No projects yet</p>
          <Link to="/projects/create" className="btn-primary">Create the First Project</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
        <Link to="/projects/create" className="btn-primary">Create Project</Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project._id} to={`/projects/${project._id}`} className="card hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.map((tech, index) => (
                <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">{tech}</span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-gray-600">
                <FaUser size={16} />
                <span className="text-sm">{project.userId ? project.userId.username : 'Unknown'}</span>
              </div>
              <div className="flex space-x-3">
                <FaGithub size={18} className="text-gray-600" />
                <FaExternalLinkAlt size={16} className="text-gray-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;
