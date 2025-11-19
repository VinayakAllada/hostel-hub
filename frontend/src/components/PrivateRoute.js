import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/student/login'} />;
  }

  if (user && user.role !== role) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/student/login'} />;
  }

  return children;
};

export default PrivateRoute;

