import {
  getMockDiscoveryAccount,
  listMockDiscoveryBrowseProfiles,
} from './mockDiscoveryAccounts.js';
import {
  createMockConnection,
  deleteMockConnection,
  listMockConnections,
  updateMockConnection,
} from './mockConnections.js';
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
      if (userEmail) {
        if (session?.profile?.user_email === userEmail) {
          return [session.profile];
        }
        const account = getMockDiscoveryAccount(userEmail);
        return account ? [account.profile] : [];
      }
      const browseAs = session?.user?.email;
      return listMockDiscoveryBrowseProfiles(browseAs);
    }
    if (entityPath.entity === 'Connection') {
      const filters = Object.fromEntries(entityPath.params.entries());
      return listMockConnections(filters);
    }
    return [];
  }

  if (path.startsWith('/api/entities/') && upperMethod === 'GET') {
    return [];
  }

  if (path.startsWith('/api/entities/Connection') && upperMethod === 'POST') {
    return createMockConnection(body);
  }

  const connectionPatch = path.match(/^\/api\/entities\/Connection\/([^/?]+)/);
  if (connectionPatch) {
    const id = connectionPatch[1];
    if (upperMethod === 'PATCH') {
      return updateMockConnection(id, body) || {};
    }
    if (upperMethod === 'DELETE') {
      deleteMockConnection(id);
      return {};
    }
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
