import { getTokenFromRequest, getUserBySessionToken } from '../auth.js';

export async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    const user = await getUserBySessionToken(token);
    if (!user) {
      return res.status(401).json({ error: 'auth_required' });
    }
    req.user = user;
    req.sessionToken = token;
    return next();
  } catch (error) {
    return res.status(500).json({ error: 'auth_failed' });
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (token) {
      req.user = await getUserBySessionToken(token);
      req.sessionToken = token;
    }
    return next();
  } catch {
    return next();
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'admin_required' });
  }
  return next();
}
