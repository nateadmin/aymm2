import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/Welcome" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function RequireProfile() {
  const { user } = useAuth();
  const location = useLocation();

  if (user && user.hasProfile === false && location.pathname !== '/ProfileSetup') {
    return <Navigate to="/ProfileSetup" replace />;
  }

  return <Outlet />;
}
