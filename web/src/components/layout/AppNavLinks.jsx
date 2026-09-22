import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getVisibleNavItems } from '@/lib/navigation';
import {
  REVIEW_HOME_ROUTE,
  REVIEW_PROFILE_ROUTE,
  withPreviewQuery,
} from '@/lib/screenCatalog';
import { isMockAuthEnabled } from '@/lib/mockAuth';
import { isStagingPreviewEnabled } from '@/lib/stagingPreview';
import { useAuth } from '@/lib/auth';

function reviewPath(path) {
  if (!isStagingPreviewEnabled() && !isMockAuthEnabled()) return path;
  if (path === '/Home') return REVIEW_HOME_ROUTE;
  if (path === '/Profile') return REVIEW_PROFILE_ROUTE;
  return path;
}

export default function AppNavLinks({ className = 'app-sidebar__nav' }) {
  const location = useLocation();
  const { isFamily, isAdmin } = useAuth();
  const items = getVisibleNavItems({ isFamily, isAdmin });

  return (
    <nav className={className} aria-label="Primary">
      {items.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path;
        return (
          <Link
            key={path}
            to={withPreviewQuery(reviewPath(path), { native: false })}
            className={`app-nav-link${active ? ' app-nav-link--active' : ''}`}
          >
            <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
