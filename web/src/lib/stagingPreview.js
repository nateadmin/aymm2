const STORAGE_KEY = 'aymm_staging_preview';
const STAGING_HOSTS = new Set(['aymm.app', 'www.aymm.app', 'aymmapp.com', 'localhost', '127.0.0.1']);

export function isStagingHost() {
  if (typeof window === 'undefined') return false;
  return STAGING_HOSTS.has(window.location.hostname);
}

/** On staging hosts, skip login by default so every screen link works. */
export function isStagingPreviewEnabled() {
  if (!isStagingHost()) return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function disableStagingPreview() {
  sessionStorage.setItem(STORAGE_KEY, 'off');
}

export function enableStagingPreview() {
  sessionStorage.removeItem(STORAGE_KEY);
}
