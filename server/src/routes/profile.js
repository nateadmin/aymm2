import { Router } from 'express';
import { withClient } from '../db.js';
import { serializeProfile } from '../profileSerialize.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const JSON_FIELDS = new Set([
  'seeking_types',
  'profile_photos',
  'seeking_for',
  'seeking_sibling_reasons',
]);

function serializeValue(key, value) {
  if (JSON_FIELDS.has(key) && value !== undefined) {
    return JSON.stringify(value);
  }
  return value;
}

function buildProfilePayload(body, email) {
  const payload = { ...body, user_email: email };
  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;
  return payload;
}

router.get('/me', requireAuth, async (req, res) => {
  const row = await withClient(async (client) => {
    const result = await client.query(
      'SELECT * FROM profiles WHERE user_email = $1 LIMIT 1',
      [req.user.email],
    );
    return result.rows[0] || null;
  });

  res.json({ profile: serializeProfile(row) });
});

router.put('/me', requireAuth, async (req, res) => {
  const email = req.user.email;
  const payload = buildProfilePayload(req.body, email);
  const keys = Object.keys(payload).filter((key) => key !== 'user_email');

  if (!keys.length) {
    return res.status(400).json({ error: 'empty_payload' });
  }

  const row = await withClient(async (client) => {
    const existing = await client.query(
      'SELECT * FROM profiles WHERE user_email = $1 LIMIT 1',
      [email],
    );

    if (existing.rows[0]) {
      const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = keys.map((key) => serializeValue(key, payload[key]));
      values.push(email);
      const result = await client.query(
        `UPDATE profiles SET ${setClause}, updated_at = NOW() WHERE user_email = $${values.length} RETURNING *`,
        values,
      );
      return result.rows[0];
    }

    if (!payload.display_name || !payload.identity_type) {
      return null;
    }

    const insertKeys = [...keys, 'user_email'];
    const columns = insertKeys.join(', ');
    const placeholders = insertKeys.map((_, index) => `$${index + 1}`).join(', ');
    const values = keys.map((key) => serializeValue(key, payload[key]));
    values.push(email);
    const result = await client.query(
      `INSERT INTO profiles (${columns}) VALUES (${placeholders}) RETURNING *`,
      values,
    );
    return result.rows[0];
  });

  if (!row) {
    return res.status(400).json({ error: 'display_name_and_identity_required' });
  }

  res.json({ profile: serializeProfile(row) });
});

export default router;
