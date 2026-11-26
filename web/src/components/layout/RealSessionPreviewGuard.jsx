import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStoredToken } from '@/api/client';
import { useAuth } from '@/lib/auth';
import { isMockToken } from '@/lib/mockAuth';
import { disableStagingPreview, isDesignReviewHost } from '@/lib/stagingPreview';

/**
 * Signed-in users on aymm.app with a server session must stay on preview=0.
 * preview=1 turns on mock auth and can show the wrong demo profile (e.g. Linda).
 */
export default function RealSessionPreviewGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
  if (!isDesignReviewHost()) return;

    const token = getStoredToken();
    if (!token || isMockToken(token)) return;

    const params = new URLSearchParams(location.search);
    if (params.get('preview') !== '1') return;

    disableStagingPreview();
    params.set('preview', '0');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [isAuthenticated, location.pathname, location.search, navigate]);

  return null;
}