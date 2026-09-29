#!/usr/bin/env bash
set -euo pipefail

# One-time Philosophy Untangled slot on the shared Contabo host.
# Does not install an app systemd unit or Apache vhost; those arrive in the app repo.

PROJECT="philosophy-untangled"
APP_ROOT="/opt/${PROJECT}"
REPO_URL="https://github.com/nateadmin/philosophy-untangled.git"
DEPLOY_USER="deploy"
INFISICAL_PROJECT_ID="${INFISICAL_PROJECT_ID:-62d21130-f58d-4b00-93e4-e221bef5fe33}"
INFISICAL_ENV="${INFISICAL_ENV:-prod}"
PORT="${PORT:-3001}"

log() {
  echo "[setup-philosophy-untangled] $*"
}

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root." >&2
  exit 1
fi

install -d -m 755 "${APP_ROOT}"
chown "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_ROOT}"
git config --global --add safe.directory "${APP_ROOT}/repo"
sudo -u "${DEPLOY_USER}" git config --global --add safe.directory "${APP_ROOT}/repo"

if [[ ! -d "${APP_ROOT}/repo/.git" ]]; then
  if sudo -u "${DEPLOY_USER}" git clone "${REPO_URL}" "${APP_ROOT}/repo"; then
    log "Cloned ${REPO_URL}"
  else
    log "GitHub clone failed; initializing empty repo at ${APP_ROOT}/repo"
    sudo -u "${DEPLOY_USER}" git init "${APP_ROOT}/repo"
    sudo -u "${DEPLOY_USER}" git -C "${APP_ROOT}/repo" remote add origin "${REPO_URL}" || true
  fi
fi

install -d -m 750 -o root -g deploy "/etc/${PROJECT}"
bootstrap="/etc/${PROJECT}/infisical-machine.env"
if [[ ! -f "${bootstrap}" ]]; then
  if [[ -z "${INFISICAL_CLIENT_ID:-}" || -z "${INFISICAL_CLIENT_SECRET:-}" ]]; then
    if [[ -f /etc/aymm/infisical-machine.env ]]; then
      # shellcheck disable=SC1091
      source /etc/aymm/infisical-machine.env
    fi
  fi
  if [[ -n "${INFISICAL_CLIENT_ID:-}" && -n "${INFISICAL_CLIENT_SECRET:-}" ]]; then
    umask 077
    cat > "${bootstrap}" <<EOF
INFISICAL_CLIENT_ID=${INFISICAL_CLIENT_ID}
INFISICAL_CLIENT_SECRET=${INFISICAL_CLIENT_SECRET}
INFISICAL_PROJECT_ID=${INFISICAL_PROJECT_ID}
INFISICAL_ENV=${INFISICAL_ENV}
EOF
    chown root:deploy "${bootstrap}"
    chmod 640 "${bootstrap}"
    log "Wrote ${bootstrap}"
  else
    log "Skipped Infisical bootstrap; set INFISICAL_CLIENT_ID and INFISICAL_CLIENT_SECRET"
  fi
fi

printf 'PORT=%s\n' "${PORT}" > "/etc/${PROJECT}/port.env"
chown root:deploy "/etc/${PROJECT}/port.env"
chmod 640 "/etc/${PROJECT}/port.env"
log "Reserved port ${PORT} in /etc/${PROJECT}/port.env"
log "Slot ready. Deploy door will fail until ${APP_ROOT}/repo/deploy/deploy.sh exists."
