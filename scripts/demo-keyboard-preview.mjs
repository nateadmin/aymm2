import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = '/opt/cursor/artifacts/keyboard-preview';
const baseUrl = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173';
const { chromium: pwChromium } = await import(
  pathToFileURL(path.join(root, 'web/node_modules/playwright/index.mjs')).href
);

fs.mkdirSync(outDir, { recursive: true });

const browser = await pwChromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

async function simulateKeyboard(page) {
  await page.evaluate(() => {
    const KEYBOARD_PX = 320;
    document.documentElement.dataset.keyboardOpen = 'true';
    document.documentElement.style.setProperty('--keyboard-inset', `${KEYBOARD_PX}px`);
    if (!document.getElementById('demo-kb')) {
      const kb = document.createElement('div');
      kb.id = 'demo-kb';
      kb.style.cssText =
        'position:fixed;left:0;right:0;bottom:0;height:320px;background:rgba(22,22,26,0.92);color:#fff;display:flex;align-items:flex-start;justify-content:center;padding-top:1rem;z-index:9999;font:600 14px system-ui;pointer-events:none';
      kb.textContent = 'Simulated software keyboard (320px)';
      document.body.appendChild(kb);
    }

    const scrollIntoThumbZone = (element, ctaReserve = 80) => {
      if (!element) return;
      const body = element.closest('.mobile-screen__body') || document.scrollingElement;
      const margin = 12;
      const visibleBottom = window.innerHeight - KEYBOARD_PX - margin - ctaReserve;
      const rect = element.getBoundingClientRect();
      if (rect.bottom > visibleBottom) {
        body.scrollTop += rect.bottom - visibleBottom;
      }
    };

    scrollIntoThumbZone(document.activeElement);
    const pad = document.activeElement?.closest('.screen-pad, .auth-page');
    const action = pad?.querySelector(
      ':scope > .auth-page__footer, :scope > .aymm-button, :scope > .connection-success__actions',
    );
    scrollIntoThumbZone(action, 12);
  });
}

const scenarios = [
  {
    name: 'phone-login',
    url: `${baseUrl}/PhoneLogin?preview=1&mobile=1`,
    focus: 'input[type="tel"]',
  },
  {
    name: 'forgot-password',
    url: `${baseUrl}/ForgotPassword?preview=1&mobile=1`,
    focus: 'input[type="email"]',
  },
];

for (const scenario of scenarios) {
  await page.goto(scenario.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, `${scenario.name}-before.png`) });

  await page.locator(scenario.focus).first().click();
  await page.waitForTimeout(200);
  await simulateKeyboard(page);
  await page.waitForTimeout(350);

  await page.screenshot({ path: path.join(outDir, `${scenario.name}-after.png`) });
}

await browser.close();
console.log(`Saved keyboard preview shots to ${outDir}`);
