#!/usr/bin/env node
/**
 * Captures Home browse profile modal for layout QA.
 * Requires dev server on 5173 with AYMM_API_PROXY=https://aymm.app (or local API).
 */
import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.CAPTURE_BASE || 'http://127.0.0.1:5173';
const OUT = process.env.CAPTURE_OUT
  || path.resolve('/opt/cursor/artifacts/browse-profile-layout-fix.png');
const EMAIL = process.env.CAPTURE_EMAIL || 'phase2.linda+demo@aymm.app';
const PASSWORD = process.env.CAPTURE_PASSWORD || 'DemoPass123';

async function main() {
  await mkdir(path.dirname(OUT), { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  const loginRes = await page.request.post(`${BASE}/api/auth/login`, {
    data: { email: EMAIL, password: PASSWORD },
  });
  if (!loginRes.ok()) {
    throw new Error(`Login failed: ${loginRes.status()}`);
  }
  const { token } = await loginRes.json();
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((t) => {
    localStorage.setItem('aymm_session_token', t);
  }, token);

  await page.goto(`${BASE}/Home?preview=0&mobile=1&native=0`, { waitUntil: 'networkidle' });
  const railCard = page.locator('.profile-rail-card').first();
  await railCard.waitFor({ state: 'visible', timeout: 20000 });
  await railCard.click();
  await page.locator('.modal-shell--profile-detail').waitFor({ state: 'visible' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: OUT, fullPage: false });
  await browser.close();
  console.log(`Saved ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});