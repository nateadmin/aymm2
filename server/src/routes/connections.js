import { Router } from 'express';
import { withClient } from '../db.js';
import { rowToEntity } from '../entities.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function deserializeConnection(row) {
  return rowToEntity(row);
}

/** All connections for the signed-in user (no query-string email filters). */
router.get('/mine', requireAuth, async (req, res) => {
  const email = req.user.email;
  const rows = await withClient(async (client) => {
    const result = await client.query(
      `SELECT * FROM connections
       WHERE from_email = $1 OR to_email = $1
       ORDER BY created_at DESC`,
      [email],
    );
    return result.rows;
  });
  res.json(rows.map(deserializeConnection));
});

export default router;