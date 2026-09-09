import { Router } from 'express';
import { withClient } from '../db.js';
import {
  ENTITY_REGISTRY,
  canReadEntity,
  canWriteEntity,
  isAdmin,
  parseSort,
  rowToEntity,
} from '../entities.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const JSON_FIELDS = new Set([
  'seeking_types',
  'profile_photos',
  'seeking_for',
  'seeking_sibling_reasons',
  'event_photos',
  'attendees',
]);

function serializeValue(key, value) {
  if (JSON_FIELDS.has(key) && value !== undefined) {
    return JSON.stringify(value);
  }
  return value;
}

function deserializeRow(row) {
  const entity = rowToEntity(row);
  for (const key of JSON_FIELDS) {
    if (entity[key] && typeof entity[key] === 'string') {
      entity[key] = JSON.parse(entity[key]);
    }
  }
  return entity;
}

function buildFilterQuery(table, filters, sortField, limit) {
  const clauses = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(filters)) {
    clauses.push(`${key} = $${index}`);
    values.push(value);
    index += 1;
  }

  const { column, direction } = parseSort(sortField);
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const limitClause = limit ? `LIMIT ${Number(limit)}` : '';

  const sql = `SELECT * FROM ${table} ${where} ORDER BY ${column} ${direction} ${limitClause}`;
  return { sql, values };
}

router.get('/:entity', requireAuth, async (req, res) => {
  const entityName = req.params.entity;
  const config = ENTITY_REGISTRY[entityName];
  if (!config || !canReadEntity(entityName, req.user)) {
    return res.status(404).json({ error: 'entity_not_found' });
  }

  const filters = { ...req.query };
  delete filters.sort;
  delete filters.limit;

  const { sql, values } = buildFilterQuery(
    config.table,
    filters,
    req.query.sort || config.sortDefault,
    req.query.limit,
  );

  const rows = await withClient(async (client) => {
    const result = await client.query(sql, values);
    return result.rows.map(deserializeRow);
  });

  res.json(rows);
});

router.get('/:entity/:id', requireAuth, async (req, res) => {
  const entityName = req.params.entity;
  const config = ENTITY_REGISTRY[entityName];
  if (!config || !canReadEntity(entityName, req.user)) {
    return res.status(404).json({ error: 'entity_not_found' });
  }

  const row = await withClient(async (client) => {
    const result = await client.query(`SELECT * FROM ${config.table} WHERE id = $1`, [req.params.id]);
    return result.rows[0] || null;
  });

  if (!row) {
    return res.status(404).json({ error: 'not_found' });
  }

  res.json(deserializeRow(row));
});

router.post('/:entity', requireAuth, async (req, res) => {
  const entityName = req.params.entity;
  const config = ENTITY_REGISTRY[entityName];
  if (!config) {
    return res.status(404).json({ error: 'entity_not_found' });
  }

  const payload = { ...req.body };
  if (!canWriteEntity(entityName, req.user, payload, req.user.email)) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const keys = Object.keys(payload).filter((key) => key !== 'id');
  if (!keys.length) {
    return res.status(400).json({ error: 'empty_payload' });
  }

  const columns = keys.join(', ');
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const values = keys.map((key) => serializeValue(key, payload[key]));

  const row = await withClient(async (client) => {
    const result = await client.query(
      `INSERT INTO ${config.table} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values,
    );
    return result.rows[0];
  });

  res.status(201).json(deserializeRow(row));
});

router.patch('/:entity/:id', requireAuth, async (req, res) => {
  const entityName = req.params.entity;
  const config = ENTITY_REGISTRY[entityName];
  if (!config) {
    return res.status(404).json({ error: 'entity_not_found' });
  }

  const existing = await withClient(async (client) => {
    const result = await client.query(`SELECT * FROM ${config.table} WHERE id = $1`, [req.params.id]);
    return result.rows[0] || null;
  });

  if (!existing) {
    return res.status(404).json({ error: 'not_found' });
  }

  if (!canWriteEntity(entityName, req.user, existing, req.user.email)) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const payload = { ...req.body };
  delete payload.id;
  const keys = Object.keys(payload);
  if (!keys.length) {
    return res.status(400).json({ error: 'empty_payload' });
  }

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = keys.map((key) => serializeValue(key, payload[key]));
  values.push(req.params.id);

  const row = await withClient(async (client) => {
    const result = await client.query(
      `UPDATE ${config.table} SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values,
    );
    return result.rows[0];
  });

  if (entityName === 'IdentityChangeRequest' && payload.status === 'approved' && isAdmin(req.user)) {
    await withClient(async (client) => {
      await client.query(
        'UPDATE profiles SET identity_type = $1, updated_at = NOW() WHERE user_email = $2',
        [existing.requested_identity, existing.user_email],
      );
    });
  }

  res.json(deserializeRow(row));
});

router.delete('/:entity/:id', requireAuth, async (req, res) => {
  const entityName = req.params.entity;
  const config = ENTITY_REGISTRY[entityName];
  if (!config) {
    return res.status(404).json({ error: 'entity_not_found' });
  }

  const existing = await withClient(async (client) => {
    const result = await client.query(`SELECT * FROM ${config.table} WHERE id = $1`, [req.params.id]);
    return result.rows[0] || null;
  });

  if (!existing) {
    return res.status(404).json({ error: 'not_found' });
  }

  if (!canWriteEntity(entityName, req.user, existing, req.user.email)) {
    return res.status(403).json({ error: 'forbidden' });
  }

  await withClient(async (client) => {
    await client.query(`DELETE FROM ${config.table} WHERE id = $1`, [req.params.id]);
  });

  res.json({ ok: true });
});

export default router;
