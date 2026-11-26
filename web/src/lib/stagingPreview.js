const STORAGE_KEY = 'aymm_staging_preview';

const EXACT_PREVIEW_HOSTS = new Set([
  'aymm.app',
  'www.aymm.app',
  'aymmapp.com',
  'www.aymmapp.com',
  'localhost',
  '127.0.0.1',
]);

/** Public production host — live app by default; design/mock only with ?preview=1 */
const PRODUCTION_BRANDED_HOSTS = new Set([
  'aymm.app',
  'www.aymm.app',
  'aymmapp.com',
  'www.aymmapp.com',
]);

export function isProductionBrandedHost(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  return Boolean(hostname) && PRODUCTION_BRANDED_HOSTS.has(hostname);
}

/** Hosts used by StackBlitz, WebContainers, Codespaces, etc. */
const PREVIEW_HOST_SUFFIXES = [
  '.webcontainer.io',
  '.webcontainer-api.io',
  '.local.webcontainer.io',
  '.local-corp.webcontainer-api.io',
  '.stackblitz.io',
  '.github.dev',
  '.githubpreview.dev',
  '.github.io',
  '.trycloudflare.com',
];

export function readPreviewParam() {
  try {
    return new URLSearchParams(window.location.search).get('preview');
  } catch {
    return null;
  }
}

/** Show /Prototype/* fixture shells while logged in with ?preview=0 (catalog Live test). */
export function isCatalogFixtureReview() {
  try {
    return new URLSearchParams(window.location.search).get('fixture') === '1';
  } catch {
    return false;
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
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (param === '1' || param === '0' || isDesignReviewHost()) {
    try {
      if (param === '1') {
        sessionStorage.removeItem(STORAGE_KEY);
      } else if (param === '0') {
        sessionStorage.setItem(STORAGE_KEY, 'off');
      } else if (isProductionBrandedHost(hostname)) {
        // aymm.app: real signup/login by default (no ?preview=0 required on every link)
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
 * - On aymm.app / aymmapp.com: **live app by default** (mock only when `?preview=1`)
 * - Other review hosts: bypass on by default unless session is off
 */
export function isStagingPreviewEnabled() {
  const param = readPreviewParam();
  if (param === '1') return true;
  if (param === '0') return false;

  if (!isDesignReviewHost()) return false;

  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (isProductionBrandedHost(hostname)) {
    return false;
  }

  try {
    return sessionStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

/** True when the user forced real login/app behavior (?preview=0) on a review host. */
export function isRealAppPreviewForced() {
  const param = readPreviewParam();
  if (param === '0') return true;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'off';
  } catch {
    return false;
  }
}

export function disableStagingPreview() {
  sessionStorage.setItem(STORAGE_KEY, 'off');
}

export function enableStagingPreview() {
  sessionStorage.removeItem(STORAGE_KEY);
}
