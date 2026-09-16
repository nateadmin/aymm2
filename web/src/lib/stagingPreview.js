const STORAGE_KEY = 'aymm_staging_preview';
const STAGING_HOSTS = new Set(['aymm.app', 'www.aymm.app', 'aymmapp.com', 'www.aymmapp.com', 'localhost', '127.0.0.1']);

export function isStagingHost() {
  if (typeof window === 'undefined') return false;
  return STAGING_HOSTS.has(window.location.hostname);
}

function readPreviewParam() {
  try {
    return new URLSearchParams(window.location.search).get('preview');
  } catch {
    return null;
  }
}

/** Call before React mounts so the first route guard sees preview mode. */
export function initStagingPreview() {
  if (!isStagingHost()) return;

  const param = readPreviewParam();
  try {
    if (param === '1') {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    if (param === '0') {
      sessionStorage.setItem(STORAGE_KEY, 'off');
      return;
    }
  } catch {
    // sessionStorage may be blocked; fall through to default-on below.
  }
}

/** On staging hosts, skip login by default so every screen link works. */
export function isStagingPreviewEnabled() {
  if (!isStagingHost()) return false;

  const param = readPreviewParam();
  if (param === '1') return true;
  if (param === '0') return false;

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
