const STORAGE_KEY = 'aymm_mobile_preview';

function applyMobilePreview(enabled) {
  if (typeof document === 'undefined') return;
  if (enabled) {
    document.documentElement.dataset.mobilePreview = 'true';
  } else {
    delete document.documentElement.dataset.mobilePreview;
  }
}

export function syncMobilePreview(search = typeof window !== 'undefined' ? window.location.search : '') {
  const param = new URLSearchParams(search).get('mobile');

  try {
    if (param === '1') {
      applyMobilePreview(true);
      sessionStorage.setItem(STORAGE_KEY, 'on');
      return;
    }
    if (param === '0') {
      applyMobilePreview(false);
      sessionStorage.setItem(STORAGE_KEY, 'off');
      return;
    }
    if (sessionStorage.getItem(STORAGE_KEY) === 'on') {
      applyMobilePreview(true);
    }
  } catch {
    if (param === '1') applyMobilePreview(true);
    if (param === '0') applyMobilePreview(false);
  }
}

/** Call before React mounts so layout CSS applies on first paint. */
export function initMobilePreview() {
  syncMobilePreview();
}

export function isMobilePreviewEnabled() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dataset.mobilePreview === 'true';
}

export function withMobileQuery(route) {
  let url = route;
  if (!url.includes('mobile=1')) {
    url += url.includes('?') ? '&mobile=1' : '?mobile=1';
  }
  return url;
}
