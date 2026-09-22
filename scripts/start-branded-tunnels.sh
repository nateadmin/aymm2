#!/usr/bin/env bash
# Named public previews only — aymm-catalog / aymm-demo / aymm-login on port 4173.
set -euo pipefail
PORT="${1:-4173}"
for name in aymm-catalog aymm-demo aymm-login; do
  echo "https://${name}.loca.lt"
  npx --yes localtunnel --port "${PORT}" --subdomain "${name}" &
done
wait
