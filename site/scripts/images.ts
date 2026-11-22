// Renders the site's two images from their HTML sources with headless
// Chrome: public/og.png (the link preview) and public/apple-touch-icon.png.
//
//   bun scripts/images.ts
//
// Run it after a change to scripts/og.html or scripts/icon.html, and commit
// the PNGs. CHROME sets the browser's path (macOS's Chrome by default).
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dir, '..');
const CHROME =
  process.env.CHROME ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const IMAGES = [
  { source: 'scripts/og.html', out: 'public/og.png', size: '1200,630' },
  {
    source: 'scripts/icon.html',
    out: 'public/apple-touch-icon.png',
    size: '180,180',
  },
];

for (const image of IMAGES) {
  const run = Bun.spawnSync([
    CHROME,
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${image.size}`,
    `--screenshot=${resolve(ROOT, image.out)}`,
    `file://${resolve(ROOT, image.source)}`,
  ]);
  if (run.exitCode !== 0) {
    throw new Error(`${image.out}: ${run.stderr.toString()}`);
  }
  process.stdout.write(`${image.out}\n`);
}
