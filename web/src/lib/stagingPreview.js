const STORAGE_KEY = 'aymm_staging_preview';

const EXACT_PREVIEW_HOSTS = new Set([
  'aymm.app',
  'www.aymm.app',
  'aymmapp.com',
  'www.aymmapp.com',
  'localhost',
  '127.0.0.1',
]);

/** Hosts used by StackBlitz, WebContainers, Codespaces, etc. */
const PREVIEW_HOST_SUFFIXES = [
  '.webcontainer.io',
  '.webcontainer-api.io',
  '.local.webcontainer.io',
  '.local-corp.webcontainer-api.io',
  '.stackblitz.io',
  '.github.dev',
  '.githubpreview.dev',
];

function readPreviewParam() {
  try {
    return new URLSearchParams(window.location.search).get('preview');
  } catch {
    return null;
  }
}

/** True on staging, localhost, StackBlitz, WebContainer, and Codespaces hosts. */
export function isDesignReviewHost(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  if (!hostname) return false;
  if (EXACT_PREVIEW_HOSTS.has(hostname)) return true;
  if (hostname.includes('stackblitz')) return true;
  return PREVIEW_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

/** @deprecated use isDesignReviewHost */
export function isStagingHost() {
  return isDesignReviewHost();
}

/** Call before React mounts so the first route guard sees preview mode. */
export function initStagingPreview() {
  const param = readPreviewParam();
  if (param === '1' || param === '0' || isDesignReviewHost()) {
    try {
      if (param === '1') {
        sessionStorage.removeItem(STORAGE_KEY);
      } else if (param === '0') {
        sessionStorage.setItem(STORAGE_KEY, 'off');
      }
    } catch {
      // sessionStorage may be blocked in some embedded previews.
    }
  }
}

/**
 * Skip login for design review.
 * - `?preview=1` forces bypass on any host (StackBlitz, staging, etc.)
 * - `?preview=0` forces login even on review hosts
 * - On review hosts, bypass is on by default unless turned off in session
 */
export function isStagingPreviewEnabled() {
  const param = readPreviewParam();
  if (param === '1') return true;
  if (param === '0') return false;

  if (!isDesignReviewHost()) return false;

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
