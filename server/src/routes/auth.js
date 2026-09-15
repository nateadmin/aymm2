import { Router } from 'express';
import {
  createSession,
  createUser,
  deleteSession,
  findUserByEmail,
  setUserPassword,
} from '../auth.js';
import { withClient } from '../db.js';
import { serializeProfile } from '../profileSerialize.js';
import { requireAuth } from '../middleware/auth.js';
import { hashPassword, verifyPassword } from '../password.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const profileResult = await withClient(async (client) => {
    const { rows } = await client.query(
      'SELECT * FROM profiles WHERE user_email = $1 LIMIT 1',
      [req.user.email],
    );
    return rows[0] || null;
  });

  const profile = serializeProfile(profileResult);

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      is_blocked: req.user.is_blocked,
    },
    profile,
    hasProfile: Boolean(profile?.setup_complete),
  });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'email_required' });
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'password_required' });
  }

  const normalized = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalized);
  if (existing) {
    return res.status(409).json({ error: 'email_taken' });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser(normalized, passwordHash);
  const session = await createSession(user.id);

  res.status(201).json({
    token: session.token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      is_blocked: user.is_blocked,
    },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'email_required' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'password_required' });
  }

  const normalized = email.trim().toLowerCase();
  const user = await findUserByEmail(normalized);
  if (!user || !user.password_hash) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  if (user.is_blocked) {
    return res.status(403).json({ error: 'account_blocked' });
  }

  const session = await createSession(user.id);

  res.json({
    token: session.token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      is_blocked: user.is_blocked,
    },
  });
});

router.post('/logout', requireAuth, async (req, res) => {
  if (req.sessionToken) {
    await deleteSession(req.sessionToken);
  }
  res.json({ ok: true });
});

export default router;
