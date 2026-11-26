/** Production DB personas from `server/scripts/seed-discovery-demos.js` (preview=0 / real API). */
export const PHASE2_LIVE_DEMO_PASSWORD = 'DemoPass123';

export const PHASE2_LIVE_DEMO_ACCOUNTS = [
  { email: 'phase2.sarah+demo@aymm.app', label: 'Daughter (Sarah)' },
  { email: 'phase2.micah+demo@aymm.app', label: 'Son (Micah)' },
  { email: 'phase2.linda+demo@aymm.app', label: 'Mother (Linda)' },
  { email: 'phase2.james+demo@aymm.app', label: 'Father (James)' },
  { email: 'phase2.martinez+demo@aymm.app', label: 'Family (Martinez)' },
];

const PHASE2_LIVE_EMAILS = new Set(PHASE2_LIVE_DEMO_ACCOUNTS.map((a) => a.email));

/** Postgres demo personas — always real API on aymm.app, never in-browser mock auth. */
export function isPhase2LiveDemoEmail(email) {
  return PHASE2_LIVE_EMAILS.has(String(email || '').trim().toLowerCase());
}