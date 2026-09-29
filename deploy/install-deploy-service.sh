#!/usr/bin/env bash
set -euo pipefail

ROOT="${AYMM_ROOT:-/opt/aymm/repo}"
DEPLOY_DIR="${ROOT}/deploy"
DATA_ROOT="/opt/contabo-deploy-data"
ENV_DIR="/etc/contabo-deploy"
ENV_FILE="${ENV_DIR}/deploy.env"

log() {
  echo "[install-deploy-service] $*"
}

infisical_plain() {
  local project_id="$1"
  local env_name="$2"
  local key="$3"
  local token="$4"
  INFISICAL_PROJECT_ID="${project_id}" infisical secrets get "${key}" \
    --projectId="${project_id}" \
    --env="${env_name}" \
    --plain --silent --token "${token}" 2>/dev/null || true
}

write_deploy_env() {
  install -d -m 750 -o root -g root "${ENV_DIR}"
  local aymm_bootstrap="/etc/aymm/infisical-machine.env"
  local pu_bootstrap="/etc/philosophy-untangled/infisical-machine.env"
  local aymm_id="a8d5abac-f12d-4f70-9ba0-064c63d927f4"
  local pu_id="62d21130-f58d-4b00-93e4-e221bef5fe33"
  local client_id="${INFISICAL_CLIENT_ID:-}"
  local client_secret="${INFISICAL_CLIENT_SECRET:-}"
  if [[ -f "${aymm_bootstrap}" ]]; then
    # shellcheck disable=SC1090
    source "${aymm_bootstrap}"
    client_id="${INFISICAL_CLIENT_ID:-${client_id}}"
    client_secret="${INFISICAL_CLIENT_SECRET:-${client_secret}}"
  fi
  if [[ -z "${client_id}" || -z "${client_secret}" ]]; then
    log "Infisical machine credentials missing; leave ${ENV_FILE} as-is if present"
    return 0
  fi
  local token
  token="$(infisical login --method=universal-auth \
    --client-id="${client_id}" \
    --client-secret="${client_secret}" \
    --silent 2>/dev/null | awk '/^eyJ/ {print; exit}')"
  if [[ -z "${token}" ]]; then
    log "Infisical login failed"
    return 1
  fi
  if [[ -f "${pu_bootstrap}" ]]; then
    pu_id="$(awk -F= '/^INFISICAL_PROJECT_ID=/{print $2}' "${pu_bootstrap}")"
  fi
  local aymm_secret pu_secret
  aymm_secret="$(infisical_plain "${aymm_id}" prod DEPLOY_SECRET "${token}")"
  pu_secret="$(infisical_plain "${pu_id}" prod DEPLOY_SECRET "${token}")"
  if [[ -n "${aymm_secret}" && -n "${pu_secret}" && "${aymm_secret}" == "${pu_secret}" ]]; then
    log "DEPLOY_SECRET values matched; refusing to write duplicate tokens"
    return 1
  fi
  umask 077
  cat > "${ENV_FILE}" <<EOF
AYMM_DEPLOY_SECRET=${aymm_secret}
PHILOSOPHY_UNTANGLED_DEPLOY_SECRET=${pu_secret}
DEPLOY_HTTP_HOST=127.0.0.1
DEPLOY_HTTP_PORT=3050
CONTABO_DEPLOY_DATA=${DATA_ROOT}
EOF
  chmod 600 "${ENV_FILE}"
  log "Wrote ${ENV_FILE}"
}

patch_apache_file() {
  local file="$1"
  if [[ ! -f "${file}" ]]; then
    return 0
  fi
  if grep -q 'api/internal/deploy' "${file}"; then
    return 0
  fi
  python3 - "${file}" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
needle = "    ProxyPreserveHost On\n"
insert = (
    "    ProxyPreserveHost On\n"
    "    ProxyPass /api/internal/deploy http://127.0.0.1:3050/api/internal/deploy retry=0 timeout=60\n"
    "    ProxyPassReverse /api/internal/deploy http://127.0.0.1:3050/api/internal/deploy\n"
)
if needle in text:
    text = text.replace(needle, insert, 1)
else:
    text = text.replace(
        "    ProxyPass /api ",
        "    ProxyPass /api/internal/deploy http://127.0.0.1:3050/api/internal/deploy retry=0 timeout=60\n"
        "    ProxyPassReverse /api/internal/deploy http://127.0.0.1:3050/api/internal/deploy\n"
        "    ProxyPass /api ",
        1,
    )
path.write_text(text)
PY
}

install_dirs() {
  install -d -m 755 "${DATA_ROOT}"
  install -d -m 755 "${DATA_ROOT}/deploy"
  install -d -m 755 "${DATA_ROOT}/deploy-logs"
}

install_unit() {
  install -m 644 "${DEPLOY_DIR}/contabo-deploy.service" /etc/systemd/system/contabo-deploy.service
  systemctl daemon-reload
  systemctl enable contabo-deploy
  if [[ -f "${DATA_ROOT}/deploy/current.json" ]]; then
    log "unit installed; skip restart while a deploy is running"
  else
    systemctl restart contabo-deploy
  fi
}

patch_apache() {
  patch_apache_file /etc/apache2/sites-available/aymm.conf
  patch_apache_file /etc/apache2/sites-available/aymm-le-ssl.conf
  apache2ctl configtest
  systemctl reload apache2
}

main() {
  if [[ "${EUID}" -ne 0 ]]; then
    echo "Run as root." >&2
    exit 1
  fi
  install_dirs
  write_deploy_env
  install_unit
  patch_apache
  log "contabo-deploy listening on 127.0.0.1:3050 via https://aymm.app/api/internal/deploy"
}

main "$@"
