import { api } from './client';

function buildQuery(filters = {}, sort, limit) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  if (sort) params.set('sort', sort);
  if (limit) params.set('limit', String(limit));
  const query = params.toString();
  return query ? `?${query}` : '';
}

function createEntityClient(entityName) {
  return {
    list(sort, limit) {
      const sortParam = typeof sort === 'string' ? sort : undefined;
      const limitParam = typeof limit === 'number' ? limit : undefined;
      return api.get(`/api/entities/${entityName}${buildQuery({}, sortParam, limitParam)}`);
    },
    filter(filters, sort, limit) {
      const sortParam = typeof sort === 'string' ? sort : undefined;
      const limitParam = typeof limit === 'number' ? limit : undefined;
      return api.get(`/api/entities/${entityName}${buildQuery(filters, sortParam, limitParam)}`);
    },
    get(id) {
      return api.get(`/api/entities/${entityName}/${id}`);
    },
    create(data) {
      return api.post(`/api/entities/${entityName}`, data);
    },
    update(id, data) {
      return api.patch(`/api/entities/${entityName}/${id}`, data);
    },
    delete(id) {
      return api.delete(`/api/entities/${entityName}/${id}`);
    },
  };
}

export const entities = {
  Profile: createEntityClient('Profile'),
  Connection: createEntityClient('Connection'),
  Message: createEntityClient('Message'),
  FamilyTable: createEntityClient('FamilyTable'),
  TableRequest: createEntityClient('TableRequest'),
  NewsfeedPost: createEntityClient('NewsfeedPost'),
  Comment: createEntityClient('Comment'),
  Report: createEntityClient('Report'),
  Block: createEntityClient('Block'),
  Contact: createEntityClient('Contact'),
  IdentityChangeRequest: createEntityClient('IdentityChangeRequest'),
  User: createEntityClient('User'),
};

export const authApi = {
  me() {
    return api.get('/api/auth/me');
  },
  login(email, password) {
    return api.post('/api/auth/login', { email, password });
  },
  register(email, password) {
    return api.post('/api/auth/register', { email, password });
  },
  logout() {
    return api.post('/api/auth/logout');
  },
  forgotPassword({ email, phone }) {
    return api.post('/api/auth/forgot-password', { email, phone });
  },
  resetPassword({ email, phone, password, code }) {
    return api.post('/api/auth/reset-password', { email, phone, password, code });
  },
};
