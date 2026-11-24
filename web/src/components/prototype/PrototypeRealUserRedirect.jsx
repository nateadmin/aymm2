import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { routeNeedsFixtureShell, withPreviewQuery } from '@/lib/screenCatalog';
import { isCatalogFixtureReview } from '@/lib/stagingPreview';
import { shouldUseDesignReviewShell } from '@/lib/session';

/** Prototype routes show design fixtures (e.g. Sarah). Real accounts use live app shells. */
export default function PrototypeRealUserRedirect({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, hasProfile } = useAuth();
  const usePrototype = shouldUseDesignReviewShell({ user, profile, hasProfile })
    || isCatalogFixtureReview();

  useEffect(() => {
    if (shouldUseDesignReviewShell({ user, profile, hasProfile })) return;
    if (isCatalogFixtureReview()) return;

    const path = location.pathname;
    if (routeNeedsFixtureShell(path)) {
      const params = new URLSearchParams(location.search);
      if (params.get('fixture') !== '1') {
        params.set('fixture', '1');
        navigate(`${path}?${params.toString()}`, { replace: true });
      }
      return;
    }

    const target = path.includes('/my-profile') || path.includes('/settings')
      ? '/Profile'
      : '/Home';
    navigate(withPreviewQuery(target, { native: false, preview: '0' }), { replace: true });
  }, [user, profile, hasProfile, location.pathname, location.search, navigate]);

  if (!usePrototype) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-label="Loading" />
      </div>
    );
  }

  return children;
}