import { isDesignReviewHost } from './stagingPreview.js';

const MOCK_TOKEN_PREFIX = 'mock:';
const MOCK_SESSION_KEY = 'aymm_mock_session';
const MOCK_RESET_KEY = 'aymm_mock_reset';
let memorySession = null;
let memoryReset = null;

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
  memorySession = session;
  try {
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage failures
  }
}

export function loadMockSession() {
  if (memorySession) {
    return memorySession;
  }

  try {
    const raw = sessionStorage.getItem(MOCK_SESSION_KEY);
    if (raw) {
      memorySession = JSON.parse(raw);
      return memorySession;
    }
  } catch {
    // ignore storage failures
  }

  return null;
}

export function clearMockSession() {
  memorySession = null;
  try {
    sessionStorage.removeItem(MOCK_SESSION_KEY);
  } catch {
    // ignore storage failures
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function buildUser(email) {
  return {
    id: 'mock-user-1',
    email,
    role: 'user',
    is_blocked: false,
  };
}

export function mockRegister(email, password) {
  const normalized = email.trim().toLowerCase();
  const pass = password.trim();

  if (!isValidEmail(normalized) || pass.length < 8) {
    const error = new Error('invalid_registration');
    error.status = 400;
    error.payload = { error: 'password_required' };
    throw error;
  }

  const session = {
    token: `${MOCK_TOKEN_PREFIX}${normalized}`,
    user: buildUser(normalized),
    profile: null,
  };

  saveMockSession(session);
  return session;
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

  const existing = loadMockSession();
  const session = {
    token: `${MOCK_TOKEN_PREFIX}${normalized}`,
    user: buildUser(normalized),
    profile: completeProfile
      ? existing?.profile?.setup_complete
        ? existing.profile
        : {
            user_email: normalized,
            display_name: 'Design Review',
            identity_type: 'daughter',
            setup_complete: true,
          }
      : existing?.profile ?? null,
  };

  saveMockSession(session);
  return session;
}

export function mockSaveProfile(data) {
  const session = loadMockSession();
  if (!session) {
    const error = new Error('auth_required');
    error.status = 401;
    throw error;
  }

  const profile = {
    ...(session.profile || {}),
    ...data,
    user_email: session.user.email,
    id: session.profile?.id || `mock-profile-${session.user.id}`,
  };

  session.profile = profile;
  saveMockSession(session);
  return profile;
}

export function mockUploadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        file_url: reader.result,
        file_name: file.name,
      });
    };
    reader.onerror = () => reject(new Error('upload_failed'));
    reader.readAsDataURL(file);
  });
}

function saveMockReset(reset) {
  memoryReset = reset;
  try {
    if (reset) {
      sessionStorage.setItem(MOCK_RESET_KEY, JSON.stringify(reset));
    } else {
      sessionStorage.removeItem(MOCK_RESET_KEY);
    }
  } catch {
    // ignore storage failures
  }
}

export function loadMockReset() {
  if (memoryReset) return memoryReset;
  try {
    const raw = sessionStorage.getItem(MOCK_RESET_KEY);
    if (raw) {
      memoryReset = JSON.parse(raw);
      return memoryReset;
    }
  } catch {
    // ignore storage failures
  }
  return null;
}

export function mockRequestPasswordReset({ channel, email, phone }) {
  if (channel === 'email' && !isValidEmail(email || '')) {
    const error = new Error('email_required');
    error.status = 400;
    error.payload = { error: 'email_required' };
    throw error;
  }
  if (channel === 'phone' && !(phone || '').trim()) {
    const error = new Error('phone_required');
    error.status = 400;
    error.payload = { error: 'phone_required' };
    throw error;
  }

  saveMockReset({
    channel,
    email: email?.trim().toLowerCase(),
    phone: phone?.trim(),
    requestedAt: Date.now(),
  });
  return { ok: true };
}

export function mockResetPassword({ email, phone, password, code }) {
  const pending = loadMockReset();
  const pass = password?.trim();
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPhone = phone?.trim();

  if (!pass || pass.length < 8) {
    const error = new Error('password_required');
    error.status = 400;
    error.payload = { error: 'password_required' };
    throw error;
  }

  if (!code || String(code).length < 6) {
    const error = new Error('invalid_code');
    error.status = 400;
    error.payload = { error: 'invalid_code' };
    throw error;
  }

  const matchesPending = pending
    && (pending.email === normalizedEmail || pending.phone === normalizedPhone);

  if (!matchesPending) {
    const error = new Error('reset_not_found');
    error.status = 400;
    error.payload = { error: 'reset_not_found' };
    throw error;
  }

  const session = loadMockSession();
  if (session && session.user?.email === normalizedEmail) {
    saveMockSession(session);
  }

  saveMockReset(null);
  return { ok: true };
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
