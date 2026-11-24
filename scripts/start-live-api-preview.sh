#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/server" && npm ci
cd "$ROOT/web" && npm ci
VITE_PRODUCTION_API=1 npm run build
node "$ROOT/scripts/live-api-preview-server.mjs"