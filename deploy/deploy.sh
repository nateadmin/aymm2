#!/usr/bin/env bash
set -euo pipefail

PROJECT="aymm"
APP_ROOT="/opt/${PROJECT}"
REPO_DIR="${APP_ROOT}/repo"
RELEASES_DIR="${APP_ROOT}/releases"
CURRENT_LINK="${APP_ROOT}/current"
LIVE_BRANCH="${LIVE_BRANCH:-main}"

log() {
  echo "[deploy] $*"
}

deploy_release() {
  local release_id
  release_id="$(date +%Y%m%d%H%M%S)-$(git -C "${REPO_DIR}" rev-parse --short HEAD)"
  local release_dir="${RELEASES_DIR}/${release_id}"

  log "Deploying ${release_id}"
  install -d -m 755 "${RELEASES_DIR}"
  rsync -a --delete \
    --exclude node_modules \
    --exclude .git \
    "${REPO_DIR}/" "${release_dir}/"

  cd "${release_dir}/server"
  npm ci --omit=dev
  cd - >/dev/null

  ln -sfn "${release_dir}" "${CURRENT_LINK}"
  chown -h "${DEPLOY_USER}:${DEPLOY_USER}" "${CURRENT_LINK}"
  chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_ROOT}"
}

write_version_env() {
  local sha
  sha="$(git -C "${REPO_DIR}" rev-parse HEAD)"
  umask 077
  printf 'GIT_SHA=%s\n' "${sha}" > "/etc/${PROJECT}/version.env"
  chown root:deploy "/etc/${PROJECT}/version.env"
  chmod 640 "/etc/${PROJECT}/version.env"
}

restart_service() {
  if systemctl list-unit-files | grep -q '^aymm.service'; then
    systemctl restart aymm.service
    sleep 2
    systemctl is-active --quiet aymm.service
  fi
}

pull_latest() {
  sudo -u "${DEPLOY_USER}" git -C "${REPO_DIR}" fetch origin "${LIVE_BRANCH}"
  sudo -u "${DEPLOY_USER}" git -C "${REPO_DIR}" checkout "${LIVE_BRANCH}"
  sudo -u "${DEPLOY_USER}" git -C "${REPO_DIR}" pull --ff-only origin "${LIVE_BRANCH}"
}

main() {
  if [[ ! -d "${REPO_DIR}/.git" ]]; then
    log "Repository missing at ${REPO_DIR}; run setup-server.sh first."
    exit 1
  fi

  pull_latest
  deploy_release
  write_version_env
  restart_service
  log "Deploy complete"
}

main "$@"
