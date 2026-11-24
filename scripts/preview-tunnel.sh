#!/usr/bin/env bash
# One preview server + one trycloudflare tunnel. URL is written to .preview-url
# and stays valid until this process exits. Use preview-rebuild.sh for code changes.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-4173}"
LOG="${ROOT}/.preview-tunnel.log"
URL_FILE="${ROOT}/.preview-url"

cd "$ROOT/web"
VITE_PRODUCTION_API=1 npm run build

if ! curl -sf "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
  nohup node "$ROOT/scripts/live-api-preview-server.mjs" >>"$LOG" 2>&1 &
  for _ in $(seq 1 30); do
    curl -sf "http://127.0.0.1:${PORT}/" >/dev/null && break
    sleep 0.5
  done
fi

echo "Starting cloudflared — URL is saved to .preview-url"
exec npx --yes cloudflared tunnel --url "http://127.0.0.1:${PORT}" 2>&1 | tee -a "$LOG" | while IFS= read -r line; do
  printf '%s\n' "$line"
  url="$(printf '%s' "$line" | rg -o 'https://[a-z0-9-]+\.trycloudflare\.com' | head -1 || true)"
  if [[ -n "$url" ]]; then
    printf '%s' "$url" >"$URL_FILE"
  fi
done