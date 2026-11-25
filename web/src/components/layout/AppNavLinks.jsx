import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getVisibleNavItems } from '@/lib/navigation';
import { resolveAppRoute } from '@/lib/appRoutes';
import { withNavPreviewQuery } from '@/lib/screenCatalog';
import { useAuth } from '@/lib/auth';

function reviewPath(path, session) {
  if (path === '/Home') return resolveAppRoute('home', session);
  if (path === '/Profile') return resolveAppRoute('profile', session);
  return path;
}

export default function AppNavLinks({ className = 'app-sidebar__nav' }) {
  const location = useLocation();
  const { user, profile, hasProfile, isFamily, isAdmin } = useAuth();
  const reviewSession = { user, profile, hasProfile };
  const items = getVisibleNavItems({ isFamily, isAdmin });

  return (
    <nav className={className} aria-label="Primary">
      {items.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path;
        return (
          <Link
            key={path}
            to={withNavPreviewQuery(reviewPath(path, reviewSession), reviewSession, { native: false })}
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
