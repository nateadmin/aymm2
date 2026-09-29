import { timingSafeEqual } from 'node:crypto';

export const DEPLOY_LOCK = '/var/lock/contabo-deploy.lock';
export const DEPLOY_TIMEOUT_MS = 40 * 60 * 1000;
export const DEPLOY_LOG_CAP = 200 * 1024;
export const DEPLOY_URL = 'https://aymm.app';

export const APPS = {
  aymm: {
    script: '/opt/aymm/repo/deploy/deploy.sh',
    secretEnv: 'AYMM_DEPLOY_SECRET',
    infisicalProjectName: 'AYMM',
  },
  'philosophy-untangled': {
    script: '/opt/philosophy-untangled/repo/deploy/deploy.sh',
    secretEnv: 'PHILOSOPHY_UNTANGLED_DEPLOY_SECRET',
    infisicalProjectName: 'Philosophy Untangled',
  },
};

export const APP_NAMES = Object.keys(APPS);

export function secretsMatch(expected, provided) {
  if (!expected || provided == null || provided === '') return false;
  const left = Buffer.from(String(expected));
  const right = Buffer.from(String(provided));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function bearerToken(authorization) {
  const raw = String(authorization || '');
  const match = raw.match(/^Bearer\s+(\S+)/i);
  return match ? match[1] : '';
}

export function appForToken(secretMap, provided) {
  let matched = null;
  for (const app of APP_NAMES) {
    const expected = secretMap[app] || '';
    if (secretsMatch(expected, provided)) {
      matched = matched || app;
    }
  }
  return matched;
}

export function isKnownApp(app) {
  return Object.prototype.hasOwnProperty.call(APPS, app);
}

export function parseAppField(body) {
  if (!body || body.app == null) return { error: 'app is required' };
  const app = String(body.app || '').trim();
  if (!app) return { error: 'app is required' };
  if (!isKnownApp(app)) return { error: `unknown app: ${app}` };
  return { app };
}

export function scriptPathFor(app) {
  return APPS[app]?.script || '';
}

export function scrubLogText(text) {
  return String(text || '')
    .split('\n')
    .map((line) => (/SECRET|KEY|PASSWORD|TOKEN/i.test(line) ? '[redacted]' : line))
    .join('\n');
}

export function tailText(text, cap = DEPLOY_LOG_CAP) {
  const buf = Buffer.from(String(text || ''), 'utf8');
  if (buf.length <= cap) return buf.toString('utf8');
  return buf.slice(buf.length - cap).toString('utf8');
}

export function deployIdFromDate(now = new Date()) {
  const stamp = now instanceof Date ? now : new Date(now);
  return stamp.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

export function defaultAppFromRepo({ remote = '', cwd = '' } = {}) {
  const hay = `${remote}\n${cwd}`.toLowerCase();
  if (hay.includes('philosophy-untangled')) return 'philosophy-untangled';
  if (hay.includes('aymm')) return 'aymm';
  return 'aymm';
}
