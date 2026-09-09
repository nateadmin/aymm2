import crypto from 'crypto';
import { withClient } from './db.js';

const SESSION_DAYS = 30;

export function createSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await withClient(async (client) => {
    await client.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt.toISOString()],
    );
  });

  return { token, expiresAt };
}

export async function deleteSession(token) {
  await withClient(async (client) => {
    await client.query('DELETE FROM sessions WHERE token = $1', [token]);
  });
}

export async function getUserBySessionToken(token) {
  if (!token) return null;

  const result = await withClient(async (client) => {
    const { rows } = await client.query(
      `SELECT u.id, u.email, u.role, u.is_blocked, u.created_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token],
    );
    return rows[0] || null;
  });

  return result;
}

export async function findOrCreateUser(email, { role = 'user' } = {}) {
  const normalized = email.trim().toLowerCase();

  return withClient(async (client) => {
    const existing = await client.query('SELECT * FROM users WHERE email = $1', [normalized]);
    if (existing.rows[0]) {
      return existing.rows[0];
    }

    const { rows } = await client.query(
      'INSERT INTO users (email, role) VALUES ($1, $2) RETURNING *',
      [normalized, role],
    );
    return rows[0];
  });
}

export function getTokenFromRequest(req) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.slice(7);
  }
  if (req.cookies?.aymm_session) {
    return req.cookies.aymm_session;
  }
  return null;
}
