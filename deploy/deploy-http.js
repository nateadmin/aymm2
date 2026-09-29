import {
  DEPLOY_TIMEOUT_MS,
  appForToken,
  bearerToken,
  deployIdFromDate,
  parseAppField,
} from './deploy-core.js';

function json(status, body) {
  return { status, body };
}

function urlPath(url) {
  return String(url || '').split('?')[0].replace(/\/$/, '') || '/';
}

function queryApp(url) {
  try {
    const parsed = new URL(url, 'http://127.0.0.1');
    return String(parsed.searchParams.get('app') || '').trim();
  } catch {
    return '';
  }
}

export function createDispatch({
  secrets,
  now = () => Date.now(),
  store,
  startDeploy,
}) {
  async function authorize(headers) {
    const token = bearerToken(headers.authorization || headers.Authorization);
    const app = appForToken(secrets || {}, token);
    if (!app) return { denied: json(401, { error: 'unauthorized' }) };
    return { app };
  }

  async function start(body, tokenApp) {
    const parsed = parseAppField(body || {});
    if (parsed.error) return json(400, { error: parsed.error });
    if (parsed.app !== tokenApp) {
      return json(403, { error: 'forbidden_app', allowed: tokenApp });
    }
    const startedAtMs = now();
    const current = store.readCurrent();
    if (current && (current.status === 'started' || current.status === 'running')) {
      const age = startedAtMs - Date.parse(current.startedAt || 0);
      if (!Number.isFinite(age) || age < DEPLOY_TIMEOUT_MS) {
        return json(409, { id: current.id, status: 'running' });
      }
      store.clearCurrent();
    }
    const id = deployIdFromDate(new Date(startedAtMs));
    const startedAt = new Date(startedAtMs).toISOString();
    const row = { id, status: 'started', app: parsed.app, apps: [parsed.app], startedAt };
    store.writeLastStart({ at: startedAtMs, id });
    store.writeCurrent(row);
    store.writeRun(row);
    store.appendLog(id, `started ${startedAt} app=${parsed.app}\n`);
    startDeploy({ id, app: parsed.app, startedAt });
    return json(200, { id, status: 'started' });
  }

  function rowVisible(row, tokenApp) {
    if (!row) return false;
    return row.app === tokenApp || (Array.isArray(row.apps) && row.apps.includes(tokenApp));
  }

  function runPayload(row, log) {
    if (!row) return json(404, { error: 'not_found' });
    return json(200, {
      status: row.status,
      sha: row.sha || null,
      app: row.app || (row.apps && row.apps[0]) || null,
      apps: row.apps || (row.app ? [row.app] : []),
      startedAt: row.startedAt || null,
      finishedAt: row.finishedAt || null,
      log: log || '',
    });
  }

  return async function dispatch({ method, url, headers, body }) {
    const auth = await authorize(headers || {});
    if (auth.denied) return auth.denied;
    const tokenApp = auth.app;
    const path = urlPath(url);
    if (method === 'POST' && (path === '/api/internal/deploy' || path === '/')) {
      return start(body, tokenApp);
    }
    if (method === 'GET' && (path === '/api/internal/deploy/latest' || path === '/latest')) {
      const wanted = queryApp(url) || tokenApp;
      if (wanted !== tokenApp) return json(403, { error: 'forbidden_app', allowed: tokenApp });
      const current = store.readCurrent();
      if (rowVisible(current, tokenApp)) return runPayload(current, store.readLog(current.id));
      const lastSuccess = store.readLastSuccess(tokenApp);
      if (lastSuccess) return runPayload(lastSuccess, store.readLog(lastSuccess.id));
      const last = store.readLast();
      if (rowVisible(last, tokenApp)) return runPayload(last, store.readLog(last.id));
      return json(404, { error: 'not_found' });
    }
    const idMatch = path.match(/\/api\/internal\/deploy\/([^/]+)$/) || path.match(/^\/([^/]+)$/);
    if (method === 'GET' && idMatch && idMatch[1] !== 'latest') {
      const id = idMatch[1];
      const row = store.readRun(id)
        || (store.readCurrent()?.id === id ? store.readCurrent() : null)
        || (store.readLast()?.id === id ? store.readLast() : null);
      if (row && !rowVisible(row, tokenApp)) return json(403, { error: 'forbidden_app', allowed: tokenApp });
      return runPayload(row, row ? store.readLog(id) : '');
    }
    return json(404, { error: 'not_found' });
  };
}
