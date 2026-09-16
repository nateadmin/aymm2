import {
  isMockAuthEnabled,
  isMockToken,
  loadMockSession,
  mockSaveProfile,
  mockUploadImage,
} from './mockAuth.js';

function parseEntityListPath(path) {
  const match = path.match(/^\/api\/entities\/([^/?]+)/);
  if (!match) return null;
  const entity = match[1];
  const params = new URLSearchParams(path.split('?')[1] || '');
  return { entity, params };
}

export function tryMockApi(path, method = 'GET', body, token) {
  if (!isMockAuthEnabled() || !isMockToken(token)) {
    return null;
  }

  const upperMethod = method.toUpperCase();

  if (path === '/api/profile/me' && upperMethod === 'GET') {
    const session = loadMockSession();
    return { profile: session?.profile ?? null };
  }

  if (path === '/api/profile/me' && upperMethod === 'PUT') {
    return { profile: mockSaveProfile(body) };
  }

  const entityPath = parseEntityListPath(path);
  if (entityPath) {
    const session = loadMockSession();
    if (entityPath.entity === 'Profile') {
      const userEmail = entityPath.params.get('user_email');
      if (userEmail && session?.profile) {
        return session.profile.user_email === userEmail ? [session.profile] : [];
      }
      return [];
    }
    return [];
  }

  if (path.startsWith('/api/entities/') && upperMethod === 'GET') {
    return [];
  }

  if (path.startsWith('/api/entities/') && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(upperMethod)) {
    return body && typeof body === 'object' ? { ...body, id: body.id || `mock-${Date.now()}` } : {};
  }

  return null;
}

export async function tryMockUpload(file, token) {
  if (!isMockAuthEnabled() || !isMockToken(token)) {
    return null;
  }
  return mockUploadImage(file);
}
