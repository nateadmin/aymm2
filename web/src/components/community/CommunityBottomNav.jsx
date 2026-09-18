import { Heart, Home, Newspaper, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { withPreviewQuery } from '@/lib/screenCatalog';

const ITEMS = [
  { path: '/Home', icon: Home, label: 'Home', match: (pathname) => pathname === '/Home' },
  { path: '/Community/letters-inbox', icon: Heart, label: 'Letters', match: (pathname) => pathname.includes('/Community/letters') || pathname.includes('/Community/message') || pathname.includes('/Community/open-conversation') },
  { path: '/Community/family-table-listing', icon: Newspaper, label: 'Tables', match: (pathname) => pathname.includes('/Community/family-table') || pathname.includes('/Community/request-join') || pathname.includes('/Community/register-table') || pathname.includes('/Community/table-confirmation') || pathname.includes('/Community/previous-photos') || pathname.includes('/Community/event-reminders') },
  { path: '/Profile', icon: User, label: 'Profile', match: (pathname) => pathname === '/Profile' },
];

export default function CommunityBottomNav() {
  const location = useLocation();

  return (
    <nav className="community-bottom-nav" aria-label="Primary">
      {ITEMS.map(({ path, icon: Icon, label, match }) => {
        const isActive = match(location.pathname);

        return (
          <Link
            key={path}
            to={withPreviewQuery(path)}
            className={`community-bottom-nav__link${isActive ? ' community-bottom-nav__link--active' : ''}`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
