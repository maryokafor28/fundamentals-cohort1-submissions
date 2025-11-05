import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient'; // Using our configured axios client

// Mock Project Data Interface
interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  liveLink?: string;
  repoLink?: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
}

// Mock Data - In a real app, this would come from your API
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Project Alpha',
    description: 'A revolutionary new platform for collaborative coding. Built with the latest technologies to ensure seamless real-time collaboration.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    technologies: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    liveLink: '#',
    repoLink: '#',
    status: 'Completed',
  },
  {
    id: '2',
    title: 'Project Beta',
    description: 'An AI-powered data visualization tool that helps businesses make smarter decisions. Features a dynamic and intuitive user interface.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    technologies: ['Vue.js', 'Python', 'D3.js', 'PostgreSQL'],
    liveLink: '#',
    status: 'In Progress',
  },
];

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError('');
      try {
        // In a real app, you would make an API call like this:
        // const response = await apiClient.get(`/projects/${id}`);
        // setProject(response.data);

        // For now, we'll simulate an API call with mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const foundProject = mockProjects.find(p => p.id === id);
        
        if (foundProject) {
          setProject(foundProject);
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        setError('Failed to fetch project details. You might not have access.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getStatusBadgeColor = (status: Project['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600">{error}</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Projects
        </button>
        
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <img src={project.imageUrl} alt={project.title} className="w-full h-64 object-cover" />
          
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-extrabold text-gray-900">{project.title}</h1>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(project.status)}`}>
                {project.status}
              </span>
            </div>

            <p className="text-gray-600 text-lg mb-8">{project.description}</p>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map(tech => (
                  <span key={tech} className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1">
                  View Live Project
                </a>
              )}
              {project.repoLink && (
                <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1">
                  GitHub Repository
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
