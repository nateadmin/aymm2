# aymm2

Are You My Mother (AYMM) custom stack on Contabo, rebuilt from the Base44 app in `nateadmin/aymm`.

Server: 185.198.27.3 (shared with Aldvin Gomes WordPress at aldvingomes.com)

Public URLs: https://aymm.app and https://aymmapp.com (DNS A records → 185.198.27.3)

## Staging (review every screen here)

**Screen index (all 55 links):** https://aymm.app/screens

Enable **staging preview** on that page to open partial/auth routes without logging in.

Agents and reviewers use **https://aymm.app** as the staging base. Link routes, not raw PNGs.

Design sources: `docs/ui-design/SOURCE.md`.

## Stack

- React web shell in `web/` (mobile bottom nav + desktop sidebar/right rail)
- Node.js API + static SPA host on 127.0.0.1:3000 (`systemd` unit `aymm.service`)
- PostgreSQL database `aymm` on localhost
- Apache reverse proxy vhost for `aymm.app`, `www.aymm.app`, and `aymmapp.com` (WordPress stays on `aldvingomes.com`)
- Secrets from Infisical project AYMM, prod environment

Brand identity PDFs belong in `docs/brand-identity/`. The web theme is implemented in `web/src/theme/` using those specs (colors, Patrick Hand, Kalam, button/input sizes).

Licensed `Two Turtle Doves` files belong in `web/public/fonts/two-turtle-doves.woff2` for splash/welcome wordmark rendering.

## Local web dev

```bash
cd web && npm ci && npm run dev
```

In another terminal, run the API from `server/` on port 3000.

## App shell routes

Public: `/Welcome`, `/AboutUs`, `/PrivacyPolicy`

Authenticated layout: `/Home`, `/Messages`, `/FamilyTables`, `/Newsfeed`, `/Profile`, `/AdminDashboard`

Onboarding: `/ProfileSetup`

Shell behavior mirrors production:

- Mobile uses bottom navigation.
- Desktop uses left navigation and a right sidebar slot.
- Family identity hides Home and redirects `/Home` to `/Newsfeed`.
- Admin users see the Admin tab.

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
2. Point DNS `@` and `www` for `aymm.app` and `aymmapp.com` to `185.198.27.3`.
3. Run `certbot --apache -d aymm.app -d www.aymm.app -d aymmapp.com` on the server.

## Deploy

On the server as root:

```bash
bash /opt/aymm/repo/deploy/deploy.sh
```

## Smoke checks

Agents: do not report a deploy job complete until every post-deploy URL below returns 2xx.

### Pre-deploy

1. `git pull --ff-only origin main`
2. `cd web && npm ci && npm run build`
3. `cd ../server && npm ci --omit=dev`
4. `node --check server/src/index.js`

### Deploy

1. Push to `main`.
2. `bash /opt/aymm/repo/deploy/deploy.sh` on the server.
3. `systemctl is-active aymm` and `ss -tlnp | grep 3000`.

### Post-deploy

- GET `http://127.0.0.1:3000/api/health` on server → 200 JSON `{ "ok": true }`
- GET `http://127.0.0.1:3000/api/version` on server → 200, `version` equals deployed git SHA
- GET `http://127.0.0.1:3000/Welcome` on server → 200 SPA shell
- GET `http://127.0.0.1:3000/Home` on server → 200 SPA shell
- GET `https://aymm.app/api/health` → 200
- GET `https://aymm.app/Welcome` → 200
- WordPress unchanged: GET `https://aldvingomes.com/` → 200

### Log check

`journalctl -u aymm --since "2 min ago"`

## Edge limits

Apache proxy only for now. When Caddy replaces Apache as the front door, add the internal profile from `personal-playbook/standards/security/edge-protection.md`.
