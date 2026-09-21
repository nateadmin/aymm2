import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = await import(
  pathToFileURL(path.join(root, 'web/node_modules/playwright/index.mjs')).href
);
const catalogPath = path.join(root, 'web/src/lib/screenCatalog.js');
const catalogSource = fs.readFileSync(catalogPath, 'utf8');
const screens = [...catalogSource.matchAll(
  /\{ id: (\d+), phase: \d+, slug: '([^']+)', title: '([^']+)', route: '([^']+)', status: '([^']+)' \}/g,
)].map(([, id, slug, title, route, status]) => ({
  id: Number(id),
  slug,
  title,
  route,
  status,
}));

const baseUrl = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173';
const outDir = process.env.CAPTURE_OUT_DIR || path.join(root, 'web/public/screen-captures');
const designDir = path.join(root, 'web/public/design-frames');

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
});

const failures = [];

for (const screen of screens) {
  const filename = `frame-${String(screen.id).padStart(2, '0')}.png`;
  const target = path.join(outDir, filename);

  if (screen.status === 'frame') {
    const designSource = path.join(designDir, filename);
    if (fs.existsSync(designSource)) {
      fs.copyFileSync(designSource, target);
      console.log(`Copied design frame ${screen.id}/55: ${screen.title}`);
    } else {
      failures.push(`${screen.id} ${screen.title}: missing design frame`);
    }
    continue;
  }

  const url = `${baseUrl}${screen.route}${screen.route.includes('?') ? '&' : '?'}preview=1&mobile=1`;

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(600);

    const mobileScreen = page.locator('.mobile-screen').first();
    const appContent = page.locator('.app-main__content').first();
    const designPhone = page.locator('.design-ref__phone').first();

    if (await mobileScreen.count()) {
      await mobileScreen.screenshot({ path: target });
    } else if (await appContent.count()) {
      await appContent.screenshot({ path: target });
    } else if (await designPhone.count()) {
      await designPhone.screenshot({ path: target });
    } else {
      await page.screenshot({ path: target, fullPage: false });
    }

    console.log(`Captured ${screen.id}/55: ${screen.title}`);
  } catch (error) {
    failures.push(`${screen.id} ${screen.title}: ${error.message}`);
    console.error(`Failed ${screen.id}/55: ${screen.title}`, error.message);
  }
}

await browser.close();

if (failures.length) {
  console.error('\nCapture failures:');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exitCode = 1;
}

console.log(`\nDone. ${screens.length} thumbnails in ${outDir}`);
