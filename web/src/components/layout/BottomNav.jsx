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
              to={withNavPreviewQuery(reviewPath(path, reviewSession), reviewSession, { native: false })}
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
