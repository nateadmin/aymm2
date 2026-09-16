#!/usr/bin/env bash
set -euo pipefail

PROJECT="aymm"
BOOTSTRAP_FILE="/etc/${PROJECT}/infisical-machine.env"
MAX_ATTEMPTS=3
SLEEP_SECONDS=30

emit_env() {
  local key="$1"
  local value="$2"
  printf '%s=%q\n' "${key}" "${value}"
}

if [[ -f "${BOOTSTRAP_FILE}" ]]; then
  # shellcheck disable=SC1090
  source "${BOOTSTRAP_FILE}"
fi

if [[ -z "${INFISICAL_CLIENT_ID:-}" || -z "${INFISICAL_CLIENT_SECRET:-}" ]]; then
  exit 0
fi

attempt=1
while [[ "${attempt}" -le "${MAX_ATTEMPTS}" ]]; do
  if TOKEN="$(infisical login --method=universal-auth \
      --client-id="${INFISICAL_CLIENT_ID}" \
      --client-secret="${INFISICAL_CLIENT_SECRET}" \
      --silent 2>/dev/null | awk '/^eyJ/ {print; exit}')"; then
    mapfile -t secret_lines < <(
      infisical secrets get DATABASE_URL \
        --projectId="${INFISICAL_PROJECT_ID:-a8d5abac-f12d-4f70-9ba0-064c63d927f4}" \
        --env="${INFISICAL_ENV:-prod}" \
        --plain --silent --token "${TOKEN}" 2>/dev/null || true
    )
    if [[ "${#secret_lines[@]}" -gt 0 && -n "${secret_lines[0]}" ]]; then
      emit_env "DATABASE_URL" "${secret_lines[0]}"
    fi
    exit 0
  fi
  attempt=$((attempt + 1))
  sleep "${SLEEP_SECONDS}"
done

echo "infisical-pull failed after ${MAX_ATTEMPTS} attempts" >&2
exit 1
