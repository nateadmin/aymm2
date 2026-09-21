import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = '/opt/cursor/artifacts/viewport-preview';
const baseUrl = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173';

const { chromium } = await import(
  pathToFileURL(path.join(root, 'web/node_modules/playwright/index.mjs')).href
);

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});

await page.goto(`${baseUrl}/PhoneLogin?preview=1&mobile=1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

/** Old behavior: layout height follows dynamic viewport (URL bar hidden = taller shell). */
await page.evaluate(() => {
  document.documentElement.style.setProperty('--app-visible-height', '844px');
  document.documentElement.dataset.demoViewport = 'dvh-expanded';
  const banner = document.getElementById('demo-chrome-banner');
  if (!banner) {
    const el = document.createElement('div');
    el.id = 'demo-chrome-banner';
    el.style.cssText =
      'position:fixed;top:0;left:0;right:0;padding:0.5rem;background:#3f214d;color:#fff;font:600 12px system-ui;text-align:center;z-index:9999';
    el.textContent = 'Before: 100dvh-style jump — shell stretched to 844px (browser chrome hidden)';
    document.body.prepend(el);
  }
});
await page.screenshot({ path: path.join(outDir, 'viewport-before-jump.png') });

/** New behavior: shell tracks visible viewport (URL bar visible = shorter, stable thumb zone). */
await page.evaluate(() => {
  document.documentElement.style.setProperty('--app-visible-height', '700px');
  document.documentElement.dataset.demoViewport = 'visible-sync';
  const banner = document.getElementById('demo-chrome-banner');
  if (banner) {
    banner.textContent =
      'After: --app-visible-height sync — shell locked to 700px (URL bar shown, no empty gap at bottom)';
  }
  const chrome = document.getElementById('demo-url-bar');
  if (!chrome) {
    const bar = document.createElement('div');
    bar.id = 'demo-url-bar';
    bar.style.cssText =
      'position:fixed;top:28px;left:0;right:0;height:44px;background:rgba(240,240,245,0.95);border-bottom:1px solid #ccc;display:flex;align-items:center;justify-content:center;font:12px system-ui;color:#444;z-index:9998';
    bar.textContent = 'Simulated Safari URL bar';
    document.body.appendChild(bar);
  }
});
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(outDir, 'viewport-after-stable.png') });

await browser.close();
console.log(`Saved viewport preview to ${outDir}`);
