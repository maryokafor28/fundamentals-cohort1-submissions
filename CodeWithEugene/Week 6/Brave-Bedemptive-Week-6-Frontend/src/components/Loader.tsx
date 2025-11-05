import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', message }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-pulse`}></div>
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 border-primary-600 rounded-full animate-spin border-t-transparent`}></div>
      </div>
      {message && (
        <p className="mt-4 text-gray-600 text-sm">{message}</p>
      )}
    </div>
  );
};

export default Loader;
