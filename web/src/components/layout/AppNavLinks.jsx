import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getVisibleNavItems } from '@/lib/navigation';
import { useAuth } from '@/lib/auth';

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
            to={path}
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
