import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGetMe } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { data: user, isLoading } = useGetMe();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}