const STORAGE_KEY = 'aymm_staging_preview';
const STAGING_HOSTS = new Set(['aymm.app', 'www.aymm.app', 'aymmapp.com', 'localhost', '127.0.0.1']);

export function isStagingHost() {
  if (typeof window === 'undefined') return false;
  return STAGING_HOSTS.has(window.location.hostname);
}

export function isStagingPreviewEnabled() {
  if (!isStagingHost()) return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function enableStagingPreview() {
  sessionStorage.setItem(STORAGE_KEY, '1');
}

export function disableStagingPreview() {
  sessionStorage.removeItem(STORAGE_KEY);
}
