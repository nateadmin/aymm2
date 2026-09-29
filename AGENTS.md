# Agent instructions

Claude Code cloud sessions cannot SSH. Port 443 to this server works; port 22 does not. Deploy with `node deploy/deploy-remote.js`, then smoke the live URLs. Do not tunnel and do not hand deploy commands to the owner. Do not edit `.claude/settings.json` yourself.

Production: shared Contabo host `185.198.27.3`. AYMM listens on `127.0.0.1:3000` behind `https://aymm.app`. WordPress on `aldvingomes.com` is a different vhost; leave it alone.

HTTPS deploy door: `POST https://aymm.app/api/internal/deploy` with `{ "app": "aymm" }` and `Authorization: Bearer <DEPLOY_SECRET>` from Infisical project AYMM, prod. The host service runs only `/opt/aymm/repo/deploy/deploy.sh`.

After merging to `main`, run `node deploy/deploy-remote.js` from this repo. Infisical machine credentials must already be in the environment (`INFISICAL_CLIENT_ID`, `INFISICAL_CLIENT_SECRET`).
