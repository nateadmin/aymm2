const STORAGE_KEY = 'aymm_mobile_preview';
const NATIVE_STORAGE_KEY = 'aymm_native_device';

function applyMobilePreview(enabled) {
  if (typeof document === 'undefined') return;
  if (enabled) {
    document.documentElement.dataset.mobilePreview = 'true';
  } else {
    delete document.documentElement.dataset.mobilePreview;
  }
}

function applyRealDevicePreview(enabled) {
  if (typeof document === 'undefined') return;
  if (enabled) {
    document.documentElement.dataset.realDevice = 'true';
  } else {
    delete document.documentElement.dataset.realDevice;
  }
}

export function syncMobilePreview(search = typeof window !== 'undefined' ? window.location.search : '') {
  const params = new URLSearchParams(search);
  const param = params.get('mobile');
  const native = params.get('native');

  try {
    if (param === '1') {
      applyMobilePreview(true);
      sessionStorage.setItem(STORAGE_KEY, 'on');
    } else if (param === '0') {
      applyMobilePreview(false);
      sessionStorage.setItem(STORAGE_KEY, 'off');
    } else if (sessionStorage.getItem(STORAGE_KEY) === 'on') {
      applyMobilePreview(true);
    }

    if (native === '1') {
      applyRealDevicePreview(true);
      sessionStorage.setItem(NATIVE_STORAGE_KEY, 'on');
    } else if (native === '0') {
      applyRealDevicePreview(false);
      sessionStorage.setItem(NATIVE_STORAGE_KEY, 'off');
    } else if (sessionStorage.getItem(NATIVE_STORAGE_KEY) === 'on') {
      applyRealDevicePreview(true);
    }
  } catch {
    if (param === '1') applyMobilePreview(true);
    if (param === '0') applyMobilePreview(false);
    if (native === '1') applyRealDevicePreview(true);
    if (native === '0') applyRealDevicePreview(false);
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

/** Real-device layout: no desktop phone-frame chrome or fake status bar. */
export function withRealDeviceQuery(route) {
  let url = withMobileQuery(route);
  if (!url.includes('preview=1')) {
    url += url.includes('?') ? '&preview=1' : '?preview=1';
  }
  if (!url.includes('native=1')) {
    url += '&native=1';
  }
  return url;
}
