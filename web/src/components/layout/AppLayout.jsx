import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BrandLockup from '@/components/brand/BrandLockup';
import { useAuth } from '@/lib/auth';
import AppNavLinks from './AppNavLinks';
import BottomNav from './BottomNav';
import RightSidebarShell from './RightSidebarShell';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFamily } = useAuth();

  useEffect(() => {
    if (isFamily && location.pathname === '/Home') {
      navigate('/Newsfeed', { replace: true });
    }
  }, [isFamily, location.pathname, navigate]);

  return (
    <div className="app-layout">
      <aside className="app-sidebar" aria-label="Primary navigation">
        <div className="app-sidebar__brand">
          <BrandLockup compact showSubtitle={false} />
        </div>
        <AppNavLinks />
        <div className="app-sidebar__footer">Finding your family</div>
      </aside>

      <div className="app-layout__body">
        <main className="app-main">
          <div className="app-main__content">
            <Outlet />
          </div>
          <RightSidebarShell />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
