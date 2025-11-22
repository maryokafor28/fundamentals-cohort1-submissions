import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FaPlus, FaTimes } from 'react-icons/fa';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [],
    githubLink: '',
    liveLink: '',
  });
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addTech = () => {
    if (techInput.trim() && formData.techStack.length < 10) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTech = (index) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await projectsAPI.create(formData);
      toast.success('Project created successfully!');
      navigate('/projects');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Project</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="E-Commerce Platform"
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            placeholder="Describe your project, its features, and what makes it unique..."
            maxLength={2000}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.description.length}/2000 characters
          </p>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tech Stack
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className="input-field"
              placeholder="Add technology (e.g., React, Node.js)"
              disabled={formData.techStack.length >= 10}
            />
            <button
              type="button"
              onClick={addTech}
              disabled={!techInput.trim() || formData.techStack.length >= 10}
              className="btn-primary px-4 disabled:opacity-50"
            >
              <FaPlus />
            </button>
          </div>

          {formData.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(index)}
                    className="text-primary-700 hover:text-primary-900"
                  >
                    <FaTimes size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {formData.techStack.length}/10 technologies
          </p>
        </div>

        {/* GitHub Link */}
        <div>
          <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Repository (Optional)
          </label>
          <input
            type="url"
            id="githubLink"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            className="input-field"
            placeholder="https://github.com/username/repo"
          />
        </div>

        {/* Live Link */}
        <div>
          <label htmlFor="liveLink" className="block text-sm font-medium text-gray-700 mb-1">
            Live Demo (Optional)
          </label>
          <input
            type="url"
            id="liveLink"
            name="liveLink"
            value={formData.liveLink}
            onChange={handleChange}
            className="input-field"
            placeholder="https://your-project.com"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;