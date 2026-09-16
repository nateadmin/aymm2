import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'docs/ui-design/screens');
const targetDir = path.join(root, 'web/public/design-frames');
const skipped = new Set([10, 12]);
const pool = [];

for (let index = 0; index <= 55; index += 1) {
  if (!skipped.has(index)) pool.push(index);
}

const mapping = new Map();
let poolIndex = 0;
for (let screenId = 1; screenId <= 55; screenId += 1) {
  if (screenId === 19) {
    mapping.set(screenId, 10);
    continue;
  }
  mapping.set(screenId, pool[poolIndex]);
  poolIndex += 1;
}

function sourcePath(index) {
  if (index === 0) return path.join(sourceDir, 'Replicate previous design.png');
  return path.join(sourceDir, `Replicate previous design-${index}.png`);
}

fs.mkdirSync(targetDir, { recursive: true });

for (let screenId = 1; screenId <= 55; screenId += 1) {
  const sourceIndex = mapping.get(screenId);
  const from = sourcePath(sourceIndex);
  const to = path.join(targetDir, `frame-${String(screenId).padStart(2, '0')}.png`);
  fs.copyFileSync(from, to);
  console.log(`frame-${String(screenId).padStart(2, '0')}.png <- design${sourceIndex === 0 ? '' : `-${sourceIndex}`}`);
}
