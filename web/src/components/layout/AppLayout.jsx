import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { APP_NAME } from '@/lib/navigation';
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
      <div className="app-layout__desktop">
        <aside className="app-sidebar">
          <div className="app-sidebar__brand">
            <h1 className="app-sidebar__brand-title">{APP_NAME}</h1>
            <p className="app-sidebar__brand-subtitle">Desktop shell</p>
          </div>
          <AppNavLinks />
          <div className="app-sidebar__footer">Navigation matches production routes.</div>
        </aside>

        <main className="app-main">
          <div className="app-main__content">
            <Outlet />
          </div>
          <RightSidebarShell />
        </main>
      </div>

      <div className="app-layout__mobile">
        <div className="app-layout__mobile-content">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
