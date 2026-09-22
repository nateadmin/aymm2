import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = '/opt/cursor/artifacts/otp-preview';
const baseUrl = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173';

const { chromium } = await import(
  pathToFileURL(path.join(root, 'web/node_modules/playwright/index.mjs')).href
);

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

async function capture(label, width) {
  const page = await browser.newPage({
    viewport: { width, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(`${baseUrl}/OTP?preview=1&mobile=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.evaluate((w) => {
    const tag = document.getElementById('demo-otp-label');
    if (tag) tag.remove();
    const el = document.createElement('div');
    el.id = 'demo-otp-label';
    el.style.cssText =
      'position:fixed;top:0;left:0;right:0;padding:0.45rem 0.5rem;background:#3f214d;color:#fff;font:600 11px system-ui;text-align:center;z-index:9999';
    el.textContent = `${w}px wide — 6 cells with min 40px touch targets + fluid gap`;
    document.body.prepend(el);
  }, width);
  await page.screenshot({ path: path.join(outDir, `otp-${label}.png`) });
  await page.close();
}

await capture('iphone-se-320', 320);
await capture('iphone-14-390', 390);

await browser.close();
console.log(`Saved OTP preview to ${outDir}`);
