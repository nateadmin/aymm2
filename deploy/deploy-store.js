import fs from 'node:fs';
import path from 'node:path';
import { DEPLOY_LOG_CAP, tailText } from './deploy-core.js';

export function dataPaths(dataRoot) {
  const root = dataRoot || '/opt/contabo-deploy-data';
  return {
    root,
    dir: path.join(root, 'deploy'),
    logs: path.join(root, 'deploy-logs'),
    current: path.join(root, 'deploy', 'current.json'),
    last: path.join(root, 'deploy', 'last.json'),
    lastStart: path.join(root, 'deploy', 'last-start.json'),
    runs: path.join(root, 'deploy', 'runs'),
  };
}

export function ensureDeployDirs(paths) {
  fs.mkdirSync(paths.dir, { recursive: true, mode: 0o755 });
  fs.mkdirSync(paths.logs, { recursive: true, mode: 0o755 });
  fs.mkdirSync(paths.runs, { recursive: true, mode: 0o755 });
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp.${process.pid}`;
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(tmp, file);
}

export function createFileStore(dataRoot) {
  const paths = dataPaths(dataRoot);
  ensureDeployDirs(paths);
  return {
    paths,
    readCurrent() {
      return readJson(paths.current);
    },
    writeCurrent(row) {
      writeJson(paths.current, row);
    },
    clearCurrent() {
      try {
        fs.unlinkSync(paths.current);
      } catch {
        /* missing is fine */
      }
    },
    readLast() {
      return readJson(paths.last);
    },
    writeLast(row) {
      writeJson(paths.last, row);
    },
    lastSuccessPath(app) {
      return path.join(paths.dir, `last-success-${app}.json`);
    },
    readLastSuccess(app) {
      if (!app) return readJson(path.join(paths.dir, 'last-success.json'));
      return readJson(this.lastSuccessPath(app));
    },
    writeLastSuccess(row) {
      writeJson(path.join(paths.dir, 'last-success.json'), row);
      if (row?.app) writeJson(this.lastSuccessPath(row.app), row);
    },
    readLastStart() {
      return readJson(paths.lastStart);
    },
    writeLastStart(row) {
      writeJson(paths.lastStart, row);
    },
    writeRun(row) {
      writeJson(path.join(paths.runs, `${row.id}.json`), row);
    },
    readRun(id) {
      return readJson(path.join(paths.runs, `${id}.json`));
    },
    logPath(id) {
      return path.join(paths.logs, `${id}.log`);
    },
    appendLog(id, text) {
      fs.appendFileSync(this.logPath(id), text);
    },
    readLog(id) {
      try {
        const buf = fs.readFileSync(this.logPath(id));
        if (buf.length <= DEPLOY_LOG_CAP) return buf.toString('utf8');
        return tailText(buf.slice(buf.length - DEPLOY_LOG_CAP).toString('utf8'));
      } catch {
        return '';
      }
    },
  };
}
