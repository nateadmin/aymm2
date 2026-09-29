#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEPLOY_TIMEOUT_MS, scrubLogText, scriptPathFor } from './deploy-core.js';
import { createFileStore } from './deploy-store.js';

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return '';
  return String(process.argv[index + 1] || '');
}

function gitSha(repoDir) {
  const result = spawnSync('git', ['-C', repoDir, 'rev-parse', 'HEAD'], {
    encoding: 'utf8',
    env: { ...process.env, PATH: process.env.PATH || '/usr/sbin:/usr/bin:/sbin:/bin' },
  });
  if (result.status === 0) return String(result.stdout || '').trim();
  return '';
}

function runCommand(command, args, { cwd, env, onOutput, timeoutMs }) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);
    const forward = (buf) => onOutput(scrubLogText(buf.toString('utf8')));
    child.stdout.on('data', forward);
    child.stderr.on('data', forward);
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      if (timedOut) {
        reject(new Error(`timed out after ${Math.round(timeoutMs / 60000)} minutes`));
        return;
      }
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${path.basename(command)} exited ${code ?? signal}`));
    });
  });
}

export async function runDeployJob({
  id,
  app,
  startedAt,
  store = createFileStore(process.env.CONTABO_DEPLOY_DATA || '/opt/contabo-deploy-data'),
  env = process.env,
}) {
  const began = Date.now();
  const remaining = () => Math.max(5_000, DEPLOY_TIMEOUT_MS - (Date.now() - began));
  const write = (text) => {
    const chunk = scrubLogText(text);
    store.appendLog(id, chunk.endsWith('\n') ? chunk : `${chunk}\n`);
  };
  const script = scriptPathFor(app);
  const repoDir = path.dirname(path.dirname(script));
  let sha = '';
  let status = 'failed';
  try {
    if (!script || !fs.existsSync(script)) {
      throw new Error(`deploy script missing: ${script || app}`);
    }
    write(`running ${script}`);
    const childEnv = {
      ...env,
      HOME: env.HOME || '/root',
      PATH: env.PATH || '/usr/sbin:/usr/bin:/sbin:/bin',
    };
    delete childEnv.NODE_ENV;
    await runCommand('bash', [script], {
      cwd: repoDir,
      env: childEnv,
      timeoutMs: remaining(),
      onOutput: (chunk) => store.appendLog(id, chunk),
    });
    sha = gitSha(repoDir);
    write(`HEAD ${sha}`);
    status = 'success';
    write('deploy success');
  } catch (error) {
    status = 'failed';
    write(`deploy failed: ${error.message}`);
  }
  const finishedAt = new Date().toISOString();
  const seconds = Math.round((Date.now() - began) / 1000);
  const row = { id, status, sha, app, apps: [app], startedAt, finishedAt, seconds };
  store.writeRun(row);
  store.writeLast(row);
  store.clearCurrent();
  if (status === 'success' && sha) {
    store.writeLastSuccess(row);
  }
  return row;
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirect) {
  const id = argValue('--id');
  const app = argValue('--app');
  const startedAt = argValue('--started-at') || new Date().toISOString();
  if (!id || !app) {
    console.error('deploy-run.js --id <id> --app <app>');
    process.exit(1);
  }
  runDeployJob({ id, app, startedAt }).then((row) => {
    process.exit(row.status === 'success' ? 0 : 1);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
