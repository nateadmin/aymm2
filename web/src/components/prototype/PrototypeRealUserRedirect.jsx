import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { withPreviewQuery } from '@/lib/screenCatalog';
import { shouldUseDesignReviewShell } from '@/lib/session';

/** Prototype routes show design fixtures (e.g. Sarah). Real accounts use live app shells. */
export default function PrototypeRealUserRedirect({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, hasProfile } = useAuth();
  const usePrototype = shouldUseDesignReviewShell({ user, profile, hasProfile });

  useEffect(() => {
    if (usePrototype) return;
    const path = location.pathname;
    const target = path.includes('/my-profile') || path.includes('/settings')
      ? '/Profile'
      : '/Home';
    navigate(withPreviewQuery(target, { native: false, preview: '0' }), { replace: true });
  }, [usePrototype, location.pathname, navigate]);

  if (!usePrototype) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  return children;
}