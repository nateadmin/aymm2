import express from 'express';
import pg from 'pg';

const app = express();
const port = Number(process.env.PORT || 3000);
const version = process.env.GIT_SHA || 'dev';
const databaseUrl = process.env.DATABASE_URL;

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  if (!databaseUrl) {
    return res.status(503).json({ ok: false, error: 'database_not_configured' });
  }

  const client = new pg.Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    await client.query('SELECT 1');
    return res.json({ ok: true });
  } catch (error) {
    return res.status(503).json({ ok: false, error: 'database_unreachable' });
  } finally {
    await client.end().catch(() => {});
  }
});

app.get('/api/version', (_req, res) => {
  res.json({ version });
});

app.get('/login', (_req, res) => {
  res.status(200).send('<!doctype html><html><body><h1>AYMM</h1><p>Login coming soon.</p></body></html>');
});

app.get('/', (_req, res) => {
  res.redirect('/login');
});

app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`aymm-server listening on 127.0.0.1:${port} version=${version}`);
});
