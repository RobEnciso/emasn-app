import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // If there is no user, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
