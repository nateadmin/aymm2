#!/usr/bin/env bash
# Rebuild web dist for the live-API preview server WITHOUT restarting the tunnel.
# The public URL in .preview-url stays the same until preview-tunnel.sh is stopped.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/web"
VITE_PRODUCTION_API=1 npm run build
echo "Preview bundle updated. Same URL still serves new JS/CSS (hard-refresh the browser)."
if [[ -f "$ROOT/.preview-url" ]]; then
  echo "URL: $(cat "$ROOT/.preview-url")"
fi