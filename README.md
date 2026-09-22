# aymm2

Are You My Mother (AYMM) custom stack on Contabo, rebuilt from the Base44 app in `nateadmin/aymm`.

Server: 185.198.27.3 (shared with Aldvin Gomes WordPress at aldvingomes.com)

Public URLs: https://aymm.app and https://aymmapp.com (DNS A records → 185.198.27.3)

## Staging (review every built screen here)

Permanent public review links (share these only):

| Link | URL |
|------|-----|
| **aymm catalog** | https://aymm.app/aymm-catalog |
| **aymm demo** | https://aymm.app/aymm-demo |
| **login** | https://aymm.app/aymm-login |

Sample sign-in: `design@aymm.app` / `DesignReview1`. Login bypass is on for staging automatically.

Agents link staging URLs only (not design PNGs). Design sources for dev: `docs/ui-design/SOURCE.md`.

## Stack

- React web shell in `web/` (mobile bottom nav + desktop sidebar/right rail)
- Node.js API + static SPA host on 127.0.0.1:3000 (`systemd` unit `aymm.service`)
- PostgreSQL database `aymm` on localhost
- Apache reverse proxy vhost for `aymm.app`, `www.aymm.app`, and `aymmapp.com` (WordPress stays on `aldvingomes.com`)
- Secrets from Infisical project AYMM, prod environment

Brand identity PDFs belong in `docs/brand-identity/`. The web theme is implemented in `web/src/theme/` using those specs (colors, Arial body type, Two Turtle Doves logo title, button/input sizes).

Licensed fonts live in `web/src/assets/fonts/`: `arial.woff2` (UI copy) and `two-turtle-doves.woff2` (logo title only).

## Local web dev

```bash
cd web && npm ci && npm run dev
```

Open **http://localhost:5173/screens?preview=1** to browse the screen catalog (login bypass is on for localhost).

In another terminal, run the API from `server/` on port 3000.

## Design review without installing anything

1. Open [github.com/nateadmin/aymm2](https://github.com/nateadmin/aymm2)
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. When the dev server starts, open the forwarded port and go to **`/screens?preview=1`**

Or in the browser: [StackBlitz – aymm2/web](https://stackblitz.com/github/nateadmin/aymm2/tree/main/web) → run `npm run dev` → open **`/demo?preview=1&mobile=1`**.

**Interactive demo flow:** `/demo` → Create account → profile setup → Home. Mock auth works without a backend; use any email with an 8+ character password. Quick sign-in (skips setup): `design@aymm.app` / `DesignReview1`.

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

### GitHub Actions (push to `main`)

Workflow: `.github/workflows/deploy-staging.yml` SSHs to Contabo as **root** and runs `deploy/deploy.sh`.

1. Generate a deploy key (or reuse one): `ssh-keygen -t ed25519 -f aymm-deploy -N ""`
2. Append `aymm-deploy.pub` to **`/root/.ssh/authorized_keys`** on `185.198.27.3`
3. In GitHub → **nateadmin/aymm2** → Settings → Secrets → Actions, add **`DEPLOY_SSH_KEY`** (full contents of the **private** key file)
4. Re-run **Deploy staging** (Actions tab) or push to `main`

If the secret is missing, the workflow fails with `can't connect without a private SSH key or password` and **https://aymm.app stays on an old SPA**. Routes such as `/aymm-catalog`, `/aymm-demo`, and `/screens` exist only in newer builds; on a stale bundle the app shows **Page not found** (HTTP 200, React 404).

### Manual (same result)

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
- GET `https://aymm.app/aymm-catalog` → 200 SPA shell (gallery title **AYMM demo**, 54 screen cards)
- GET `https://aymm.app/api/version` → `version` matches latest `main` (not a September 2026 SHA)
- Brand font bundled in build (`dist/assets/two-turtle-doves-*.woff2` > 10 KB after deploy)
- WordPress unchanged: GET `https://aldvingomes.com/` → 200

### Log check

`journalctl -u aymm --since "2 min ago"`

## Edge limits

Apache proxy only for now. When Caddy replaces Apache as the front door, add the internal profile from `personal-playbook/standards/security/edge-protection.md`.
