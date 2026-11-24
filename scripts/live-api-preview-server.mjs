#!/usr/bin/env node
import { createRequire } from 'node:module';

const require = createRequire(new URL('../server/package.json', import.meta.url));
const express = require('express');
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../web/dist');
const port = Number(process.env.PORT || 4173);
const upstream = process.env.AYMM_UPSTREAM || 'https://aymm.app';

function proxyToUpstream(req, res) {
  const pathAndQuery = req.originalUrl || req.url;
  const url = new URL(pathAndQuery, upstream);
  const headers = { ...req.headers, host: url.host };
  delete headers['host'];

  const requester = url.protocol === 'https:' ? https : http;
  const upstreamReq = requester.request(
    {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: req.method,
      headers,
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );

  upstreamReq.on('error', () => {
    res.statusCode = 502;
    res.end('upstream_error');
  });

  req.pipe(upstreamReq);
}

const app = express();

app.use('/api', (req, res) => proxyToUpstream(req, res));
app.use('/uploads', (req, res) => proxyToUpstream(req, res));

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, { index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    return res.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  app.get('*', (_req, res) => {
    res.status(503).send('Run web build first (VITE_PRODUCTION_API=1 npm run build in web/).');
  });
}

app.listen(port, '127.0.0.1', () => {
  console.log(`live-api preview on http://127.0.0.1:${port} -> ${upstream}`);
});