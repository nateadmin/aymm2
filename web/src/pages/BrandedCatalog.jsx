import { useEffect } from 'react';
import { syncMobilePreview } from '@/lib/mobilePreview';
import { enableStagingPreview } from '@/lib/stagingPreview';
import ScreenIndex from '@/pages/ScreenIndex';

/** Stable /aymm-catalog URL — same grid as /screens with preview flags applied. */
export default function BrandedCatalog() {
  useEffect(() => {
    enableStagingPreview();
    syncMobilePreview('?preview=1&mobile=1');
  }, []);

  return <ScreenIndex />;
}
