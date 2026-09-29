#!/usr/bin/env node
import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDispatch } from './deploy-http.js';
import { createFileStore } from './deploy-store.js';
import { APPS, DEPLOY_LOCK } from './deploy-core.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const store = createFileStore(process.env.CONTABO_DEPLOY_DATA || '/opt/contabo-deploy-data');
const host = process.env.DEPLOY_HTTP_HOST || '127.0.0.1';
const port = Number(process.env.DEPLOY_HTTP_PORT || 3050);

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1);
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile('/etc/contabo-deploy/deploy.env');

const secrets = {};
for (const [app, meta] of Object.entries(APPS)) {
  secrets[app] = process.env[meta.secretEnv] || '';
}

function startDeploy({ id, app, startedAt }) {
  const runJs = path.join(here, 'deploy-run.js');
  const child = spawn(
    'flock',
    ['-n', DEPLOY_LOCK, 'node', runJs, '--id', id, '--app', app, '--started-at', startedAt],
    {
      cwd: here,
      detached: true,
      stdio: 'ignore',
      env: { ...process.env },
    },
  );
  child.unref();
}

const dispatch = createDispatch({ secrets, store, startDeploy });

const server = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  let body = {};
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'invalid json' }));
      return;
    }
  }
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) headers[key] = value;
  const result = await dispatch({
    method: req.method,
    url: req.url,
    headers,
    body,
  });
  res.writeHead(result.status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  res.end(JSON.stringify(result.body));
});

server.listen(port, host, () => {
  console.log(`contabo-deploy listening on ${host}:${port}`);
});
