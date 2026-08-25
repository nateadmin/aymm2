#!/usr/bin/env bash
set -euo pipefail

set -a
if [[ -f /etc/aymm/database.env ]]; then
  # shellcheck disable=SC1091
  source /etc/aymm/database.env
fi
if [[ -f /etc/aymm/version.env ]]; then
  # shellcheck disable=SC1091
  source /etc/aymm/version.env
fi
if [[ -x /opt/aymm/current/deploy/infisical-pull.sh ]]; then
  eval "$(/opt/aymm/current/deploy/infisical-pull.sh)" || true
fi
set +a

export PORT="${PORT:-3000}"
exec /usr/bin/node /opt/aymm/current/server/src/index.js
