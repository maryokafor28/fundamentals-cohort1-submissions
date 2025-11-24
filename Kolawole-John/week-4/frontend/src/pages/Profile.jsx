import React from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Github, Linkedin, Edit } from 'lucide-react';
import { useGetMe } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Profile() {
  const { id } = useParams();
  const { data: currentUser, isLoading } = useGetMe();

  if (isLoading || !currentUser) {
    return <LoadingSpinner fullScreen />;
  }

  const isOwnProfile = currentUser._id === id;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-600">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {isOwnProfile && (
                <button className="btn-secondary flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentUser.name}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <Mail className="w-4 h-4 mr-2" />
              <span>{currentUser.email}</span>
            </div>
            {currentUser.bio && (
              <p className="text-gray-700 mb-6">{currentUser.bio}</p>
            )}
            {currentUser.skills && currentUser.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex space-x-4">
              {currentUser.githubUrl && (
                <a href={currentUser.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {currentUser.linkedinUrl && (
                <a href={currentUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Projects</h2>
          <p className="text-gray-600">Your projects will appear here...</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;