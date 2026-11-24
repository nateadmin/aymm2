import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { withPreviewQuery } from '@/lib/screenCatalog';
import { isRealAppPreviewForced } from '@/lib/stagingPreview';

/** Clear session and return to Welcome, keeping preview/mobile query flags when set. */
export function useAppLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useCallback(async () => {
    await logout();
    const preview = isRealAppPreviewForced() ? '0' : undefined;
    navigate(withPreviewQuery('/Welcome', { native: false, preview }), { replace: true });
  }, [logout, navigate]);
}