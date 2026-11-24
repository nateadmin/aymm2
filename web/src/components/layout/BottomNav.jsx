import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getVisibleNavItems } from '@/lib/navigation';
import {
  REVIEW_HOME_ROUTE,
  REVIEW_PROFILE_ROUTE,
  withPreviewQuery,
} from '@/lib/screenCatalog';
import { shouldUseDesignReviewShell } from '@/lib/session';
import { useAuth } from '@/lib/auth';

function reviewPath(path, session) {
  if (!shouldUseDesignReviewShell(session)) return path;
  if (path === '/Home') return REVIEW_HOME_ROUTE;
  if (path === '/Profile') return REVIEW_PROFILE_ROUTE;
  return path;
}

export default function BottomNav() {
  const location = useLocation();
  const { user, profile, hasProfile, isFamily, isAdmin } = useAuth();
  const reviewSession = { user, profile, hasProfile };
  const items = getVisibleNavItems({ isFamily, isAdmin, bottomNavOnly: true });

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav__inner">
        {items.map(({ path, icon: Icon, label }) => {
          const resolvedPath = reviewPath(path, reviewSession);
          const active = location.pathname === path
            || location.pathname === resolvedPath;
          return (
            <Link
              key={path}
              to={withPreviewQuery(reviewPath(path, reviewSession), { native: false })}
              className={`bottom-nav__link${active ? ' bottom-nav__link--active' : ''}`}
            >
              <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
