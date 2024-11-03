// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(UserContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};