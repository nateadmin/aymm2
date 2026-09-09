import { Router } from 'express';
import { createSession, deleteSession, findOrCreateUser } from '../auth.js';
import { withClient } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const profileResult = await withClient(async (client) => {
    const { rows } = await client.query(
      'SELECT * FROM profiles WHERE user_email = $1 LIMIT 1',
      [req.user.email],
    );
    return rows[0] || null;
  });

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      is_blocked: req.user.is_blocked,
    },
    profile: profileResult,
    hasProfile: Boolean(profileResult?.setup_complete),
  });
});

router.post('/login', async (req, res) => {
  const { email, role } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'email_required' });
  }

  const user = await findOrCreateUser(email, { role: role || 'user' });
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
