import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import BlockedAccountOverlay from '@/components/shared/BlockedAccountOverlay';
import { useAuth } from '@/lib/auth';

export default function RequireAuth() {
  const { isAuthenticated, isLoading, isBlocked } = useAuth();
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

  if (isBlocked) {
    return <BlockedAccountOverlay />;
  }

  return <Outlet />;
}

export function RequireProfile() {
  const { hasProfile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!hasProfile && !location.pathname.startsWith('/ProfileSetup')) {
    return <Navigate to="/ProfileSetup/upload-photo" replace />;
  }

  return <Outlet />;
}
