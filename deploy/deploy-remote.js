#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { APPS, DEPLOY_URL, defaultAppFromRepo } from './deploy-core.js';

const INFISICAL_API = (process.env.INFISICAL_API_URL || 'https://app.infisical.com').replace(/\/$/, '');

function gitRemote() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const result = spawnSync('git', ['-C', path.resolve(here, '..'), 'remote', 'get-url', 'origin'], {
    encoding: 'utf8',
  });
  return result.status === 0 ? String(result.stdout || '').trim() : '';
}

function appName() {
  if (process.env.DEPLOY_APP) return process.env.DEPLOY_APP;
  return defaultAppFromRepo({ remote: gitRemote(), cwd: process.cwd() });
}

async function infisicalLogin() {
  const clientId = process.env.INFISICAL_CLIENT_ID;
  const clientSecret = process.env.INFISICAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing INFISICAL_CLIENT_ID or INFISICAL_CLIENT_SECRET');
  }
  const res = await fetch(`${INFISICAL_API}/api/v1/auth/universal-auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.accessToken) {
    throw new Error(`Infisical login failed (${res.status})`);
  }
  return data.accessToken;
}

async function projectIdFor(token, projectName) {
  const res = await fetch(`${INFISICAL_API}/api/v1/workspace`, {
    headers: { authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  const list = Array.isArray(data.workspaces) ? data.workspaces : [];
  const match = list.filter((workspace) => String(workspace.name || '').trim() === projectName);
  if (match.length !== 1) {
    const visible = list.map((workspace) => workspace.name).filter(Boolean).join(', ') || 'none';
    throw new Error(`Infisical project "${projectName}" not found. Visible: ${visible}`);
  }
  return match[0].id || match[0]._id;
}

async function readDeploySecret(token, projectId) {
  const url = `${INFISICAL_API}/api/v3/secrets/raw/DEPLOY_SECRET?workspaceId=${encodeURIComponent(projectId)}&environment=prod&secretPath=/`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  const data = await res.json().catch(() => ({}));
  const value = data.secret?.secretValue;
  if (!res.ok || !value) {
    throw new Error('DEPLOY_SECRET is missing from Infisical');
  }
  return value;
}

const app = appName();
if (!APPS[app]) {
  console.error(`unknown app ${app}`);
  process.exit(1);
}
const projectName = process.env.INFISICAL_PROJECT_NAME || APPS[app].infisicalProjectName;
const base = (process.env.DEPLOY_URL || DEPLOY_URL).replace(/\/$/, '');

const token = await infisicalLogin();
const projectId = process.env.INFISICAL_PROJECT_ID || await projectIdFor(token, projectName);
const secret = process.env.DEPLOY_SECRET || await readDeploySecret(token, projectId);

const start = await fetch(`${base}/api/internal/deploy`, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${secret}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({ app }),
});
const started = await start.json().catch(() => ({}));
if (start.status === 409) {
  console.error(`deploy already running id=${started.id || '?'}`);
  process.exit(1);
}
if (!start.ok) {
  console.error(`start failed ${start.status} ${JSON.stringify(started)}`);
  process.exit(1);
}
const id = started.id;
if (!id) {
  console.error('start response missing id');
  process.exit(1);
}
console.log(`started ${id} app=${app}`);
let printed = 0;
const deadline = Date.now() + 45 * 60 * 1000;

while (Date.now() < deadline) {
  await new Promise((resolve) => setTimeout(resolve, 15_000));
  const res = await fetch(`${base}/api/internal/deploy/${id}`, {
    headers: { authorization: `Bearer ${secret}` },
  });
  const body = await res.json().catch(() => ({}));
  const log = String(body.log || '');
  if (log.length > printed) {
    process.stdout.write(log.slice(printed));
    printed = log.length;
  }
  if (body.status === 'success') {
    console.log(`\ndeploy ${id} success sha=${body.sha || ''}`);
    process.exit(0);
  }
  if (body.status === 'failed') {
    console.error(`\ndeploy ${id} failed`);
    process.exit(1);
  }
}

console.error(`\ndeploy ${id} timed out waiting`);
process.exit(1);
