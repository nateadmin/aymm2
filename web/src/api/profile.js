import { api, getStoredToken } from './client';
import { tryMockUpload } from '@/lib/mockApi';

export const profileApi = {
  getMine() {
    return api.get('/api/profile/me');
  },
  saveMine(data) {
    return api.put('/api/profile/me', data);
  },
};

export async function uploadImage(file) {
  const token = getStoredToken();
  const mockUpload = await tryMockUpload(file, token);
  if (mockUpload) {
    return mockUpload;
  }

  const body = new FormData();
  body.append('file', file);
  const response = await fetch('/api/uploads', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(payload?.error || 'upload_failed');
    error.status = response.status;
    throw error;
  }

  return payload;
}
