import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Users, Zap, Plus } from 'lucide-react';
import ProjectList from '../components/projects/ProjectList';
import ProjectFilters from '../components/projects/ProjectFilters';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import { useGetMe } from '../hooks/useAuth';

export default function Home() {
  const [filters, setFilters] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: user } = useGetMe();

  return (
    <div>
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Connect. Collaborate. Create.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Join a community of developers sharing projects and building amazing things together
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {user ? (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Share Your Project</span>
                </button>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Share Projects
              </h3>
              <p className="text-gray-600">
                Showcase your work and get feedback from the community
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Find Collaborators
              </h3>
              <p className="text-gray-600">
                Connect with developers who share your interests
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Build Together
              </h3>
              <p className="text-gray-600">
                Collaborate on exciting projects and learn from each other
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Explore Projects
            </h2>
            {user && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Project</span>
              </button>
            )}
          </div>

          <ProjectFilters filters={filters} setFilters={setFilters} />
          <ProjectList filters={filters} />
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}