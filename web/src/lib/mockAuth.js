import { isDesignReviewHost } from './stagingPreview.js';

const MOCK_TOKEN_PREFIX = 'mock:';
const MOCK_SESSION_KEY = 'aymm_mock_session';

export const MOCK_LOGIN_EMAIL = 'design@aymm.app';
export const MOCK_LOGIN_PASSWORD = 'DesignReview1';

const STAGING_HOSTS = new Set([
  'aymm.app',
  'www.aymm.app',
  'aymmapp.com',
  'www.aymmapp.com',
]);

/** Mock auth for StackBlitz/Codespaces/local dev — not on live staging (real API there). */
export function isMockAuthEnabled(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  if (!hostname || STAGING_HOSTS.has(hostname)) return false;
  return isDesignReviewHost(hostname);
}

export function isMockToken(token) {
  return typeof token === 'string' && token.startsWith(MOCK_TOKEN_PREFIX);
}

function saveMockSession(session) {
  try {
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage failures
  }
}

export function loadMockSession() {
  try {
    const raw = sessionStorage.getItem(MOCK_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearMockSession() {
  try {
    sessionStorage.removeItem(MOCK_SESSION_KEY);
  } catch {
    // ignore storage failures
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function mockLogin(email, password, { completeProfile = true } = {}) {
  const normalized = email.trim().toLowerCase();
  const pass = password.trim();

  const matchesDemo =
    normalized === MOCK_LOGIN_EMAIL && pass === MOCK_LOGIN_PASSWORD;
  const matchesAnyDemo = isValidEmail(normalized) && pass.length >= 8;

  if (!matchesDemo && !matchesAnyDemo) {
    const error = new Error('invalid_credentials');
    error.status = 401;
    error.payload = { error: 'invalid_credentials' };
    throw error;
  }

  const session = {
    token: `${MOCK_TOKEN_PREFIX}${normalized}`,
    user: {
      id: 'mock-user-1',
      email: normalized,
      role: 'user',
      is_blocked: false,
    },
    profile: completeProfile
      ? {
          display_name: 'Design Review',
          identity_type: 'daughter',
          setup_complete: true,
        }
      : null,
  };

  saveMockSession(session);
  return session;
}

export function mockMe(token) {
  if (!isMockToken(token)) return null;
  const session = loadMockSession();
  if (!session || session.token !== token) return null;

  return {
    user: session.user,
    profile: session.profile,
    hasProfile: Boolean(session.profile?.setup_complete),
  };
}
