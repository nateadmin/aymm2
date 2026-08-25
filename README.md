# aymm2

Are You My Mother (AYMM) custom stack on Contabo, rebuilt from the Base44 app in `nateadmin/aymm`.

Server: 185.198.27.3 (shared with Aldvin Gomes WordPress at aldvingomes.com)

Planned public URL: https://aymm.wefoundd.com (DNS must point to 185.198.27.3 before HTTPS cert issuance)

## Stack

- Node.js API on 127.0.0.1:3000 (`systemd` unit `aymm.service`)
- PostgreSQL database `aymm` on localhost
- Apache reverse proxy vhost for `aymm.wefoundd.com` (WordPress stays on its own vhost)
- Secrets from Infisical project AYMM, prod environment

## First-time server setup

Run on the Contabo server as root after pushing this repo:

```bash
export INFISICAL_CLIENT_ID='...'
export INFISICAL_CLIENT_SECRET='...'
export LIVE_BRANCH='main'
curl -fsSL https://raw.githubusercontent.com/nateadmin/aymm2/main/deploy/setup-server.sh | bash
```

Or clone the repo and run `deploy/setup-server.sh` with the Infisical machine credentials in the environment.

Platform follow-up after first boot:

1. Add `DATABASE_URL` from `/etc/aymm/database.env` into Infisical AYMM prod.
2. Point DNS `aymm.wefoundd.com` to `185.198.27.3`.
3. Run `certbot --apache -d aymm.wefoundd.com` on the server.

## Deploy

On the server as root:

```bash
bash /opt/aymm/repo/deploy/deploy.sh
```

## Smoke checks

Agents: do not report a deploy job complete until every post-deploy URL below returns 2xx.

### Pre-deploy

1. `git pull --ff-only origin main`
2. `cd server && npm ci --omit=dev`
3. `node --check server/src/index.js`

### Deploy

1. Push to `main`.
2. `bash /opt/aymm/repo/deploy/deploy.sh` on the server.
3. `systemctl is-active aymm` and `ss -tlnp | grep 3000`.

### Post-deploy

- GET `http://127.0.0.1:3000/api/health` on server → 200 JSON `{ "ok": true }`
- GET `http://127.0.0.1:3000/api/version` on server → 200, `version` equals deployed git SHA
- GET `http://127.0.0.1:3000/login` on server → 200
- After DNS + cert: GET `https://aymm.wefoundd.com/api/health` → 200
- WordPress unchanged: GET `https://aldvingomes.com/` → 200

### Log check

`journalctl -u aymm --since "2 min ago"`

## Edge limits

Apache proxy only for now. When Caddy replaces Apache as the front door, add the internal profile from `personal-playbook/standards/security/edge-protection.md`.
