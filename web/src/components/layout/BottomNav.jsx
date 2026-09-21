import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getVisibleNavItems } from '@/lib/navigation';
import { withPreviewQuery } from '@/lib/screenCatalog';
import { useAuth } from '@/lib/auth';

export default function BottomNav() {
  const location = useLocation();
  const { isFamily, isAdmin } = useAuth();
  const items = getVisibleNavItems({ isFamily, isAdmin, bottomNavOnly: true });

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav__inner">
        {items.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={withPreviewQuery(path)}
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
