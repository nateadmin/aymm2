import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import BlockedAccountOverlay from '@/components/shared/BlockedAccountOverlay';
import { useAuth } from '@/lib/auth';
import { isStagingPreviewEnabled } from '@/lib/stagingPreview';

export default function RequireAuth() {
  const { isAuthenticated, isLoading, isBlocked } = useAuth();
  const location = useLocation();
  const stagingPreview = isStagingPreviewEnabled();

  if (isLoading && !stagingPreview) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated && !stagingPreview) {
    return <Navigate to="/Welcome" replace state={{ from: location.pathname }} />;
  }

  if (isBlocked && !stagingPreview) {
    return <BlockedAccountOverlay />;
  }

  return <Outlet />;
}

export function RequireProfile() {
  const { hasProfile, isLoading } = useAuth();
  const location = useLocation();
  const stagingPreview = isStagingPreviewEnabled();

  if (isLoading && !stagingPreview) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!hasProfile && !stagingPreview && !location.pathname.startsWith('/ProfileSetup')) {
    return <Navigate to="/ProfileSetup/upload-photo" replace />;
  }

  return <Outlet />;
}
