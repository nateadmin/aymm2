#!/usr/bin/env bash
set -euo pipefail

PROJECT="aymm"
APP_ROOT="/opt/${PROJECT}"
REPO_URL="https://github.com/nateadmin/aymm2.git"
DEPLOY_USER="deploy"
INFISICAL_PROJECT_ID="a8d5abac-f12d-4f70-9ba0-064c63d927f4"
LIVE_BRANCH="${LIVE_BRANCH:-main}"

log() {
  echo "[setup-server] $*"
}

require_root() {
  if [[ "${EUID}" -ne 0 ]]; then
    echo "Run as root." >&2
    exit 1
  fi
}

install_packages() {
  log "Installing packages"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-get install -y curl ca-certificates gnupg git ufw apache2 postgresql postgresql-contrib

  if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 22 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
  fi

  if ! command -v infisical >/dev/null 2>&1; then
    curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash
    apt-get install -y infisical
  fi

  a2enmod proxy proxy_http headers rewrite ssl >/dev/null
}

configure_deploy_user() {
  log "Configuring deploy user"
  if ! id "${DEPLOY_USER}" >/dev/null 2>&1; then
    useradd --create-home --shell /bin/bash "${DEPLOY_USER}"
  fi

  install -d -m 700 "/home/${DEPLOY_USER}/.ssh"
  if [[ -f "${PUBLIC_KEY_FILE}" ]]; then
    if ! grep -qF "$(awk '{print $1}' "${PUBLIC_KEY_FILE}")" "/home/${DEPLOY_USER}/.ssh/authorized_keys" 2>/dev/null; then
      cat "${PUBLIC_KEY_FILE}" >> "/home/${DEPLOY_USER}/.ssh/authorized_keys"
    fi
  fi
  chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "/home/${DEPLOY_USER}/.ssh"
  chmod 600 "/home/${DEPLOY_USER}/.ssh/authorized_keys" 2>/dev/null || true

  install -d -m 755 "${APP_ROOT}"
  chown "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_ROOT}"
  git config --global --add safe.directory "${APP_ROOT}/repo"
  sudo -u "${DEPLOY_USER}" git config --global --add safe.directory "${APP_ROOT}/repo"
}

configure_postgres() {
  log "Configuring Postgres"
  local db_user="${PROJECT}"
  local db_name="${PROJECT}"
  local env_file="/etc/${PROJECT}/database.env"

  install -d -m 750 -o root -g deploy "/etc/${PROJECT}"
  if [[ ! -f "${env_file}" ]]; then
    local db_password
    db_password="$(openssl rand -hex 24)"
    sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${db_user}') THEN
    CREATE ROLE ${db_user} LOGIN PASSWORD '${db_password}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE ${db_name} OWNER ${db_user}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${db_name}')\\gexec
SQL
    umask 077
    cat > "${env_file}" <<EOF
DATABASE_URL=postgresql://${db_user}:${db_password}@127.0.0.1:5432/${db_name}
EOF
    chown root:deploy "${env_file}"
    chmod 640 "${env_file}"
    log "Created ${env_file}; add DATABASE_URL to Infisical prod when ready."
  fi

  if ! grep -q "listen_addresses = 'localhost'" /etc/postgresql/*/main/postgresql.conf; then
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /etc/postgresql/*/main/postgresql.conf || true
  fi
  systemctl enable postgresql
  systemctl restart postgresql
}

configure_infisical_bootstrap() {
  log "Configuring Infisical bootstrap env"
  local bootstrap_file="/etc/${PROJECT}/infisical-machine.env"
  if [[ -n "${INFISICAL_CLIENT_ID:-}" && -n "${INFISICAL_CLIENT_SECRET:-}" && ! -f "${bootstrap_file}" ]]; then
    umask 077
    cat > "${bootstrap_file}" <<EOF
INFISICAL_CLIENT_ID=${INFISICAL_CLIENT_ID}
INFISICAL_CLIENT_SECRET=${INFISICAL_CLIENT_SECRET}
INFISICAL_PROJECT_ID=${INFISICAL_PROJECT_ID}
INFISICAL_ENV=${INFISICAL_ENV}
EOF
    chown root:deploy "${bootstrap_file}"
    chmod 640 "${bootstrap_file}"
  fi
}

install_repo() {
  log "Installing repository"
  if [[ ! -d "${APP_ROOT}/repo/.git" ]]; then
    sudo -u "${DEPLOY_USER}" git clone "${REPO_URL}" "${APP_ROOT}/repo"
  fi
  sudo -u "${DEPLOY_USER}" git -C "${APP_ROOT}/repo" fetch origin "${LIVE_BRANCH}"
  sudo -u "${DEPLOY_USER}" git -C "${APP_ROOT}/repo" checkout "${LIVE_BRANCH}"
  sudo -u "${DEPLOY_USER}" git -C "${APP_ROOT}/repo" pull --ff-only origin "${LIVE_BRANCH}"
}

install_systemd() {
  log "Installing systemd unit"
  install -m 644 "${APP_ROOT}/repo/deploy/aymm.service" /etc/systemd/system/aymm.service
  systemctl daemon-reload
  systemctl enable aymm.service
}

install_apache_vhost() {
  log "Installing Apache vhost"
  install -m 644 "${APP_ROOT}/repo/deploy/apache-aymm.conf" /etc/apache2/sites-available/aymm.conf
  a2ensite aymm.conf >/dev/null
  apache2ctl configtest
  systemctl reload apache2
}

configure_firewall() {
  log "Configuring UFW"
  bash "${APP_ROOT}/repo/deploy/ufw-rules.sh"
}

main() {
  require_root
  install_packages
  configure_deploy_user
  configure_postgres
  configure_infisical_bootstrap
  install_repo
  install_systemd
  bash "${APP_ROOT}/repo/deploy/deploy.sh"
  install_apache_vhost
  configure_firewall
  log "Setup complete"
}

main "$@"
