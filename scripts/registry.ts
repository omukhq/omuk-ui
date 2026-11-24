// Writes the registry (registry-lib.ts) to site/public/r/: index.json and
// one <name>.json per item. The site serves it at ui.omuk.dev/r/, where the
// `omuk` CLI reads it. Run by the site's build; `bun run registry` by hand.

import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { buildRegistry } from './registry-lib';

const root = join(import.meta.dir, '..');
const src = join(root, 'src');
const out = join(root, 'site', 'public', 'r');

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

function read(path: string) {
  const full = join(src, path);
  return existsSync(full) && !path.endsWith('/')
    ? readFileSync(full, 'utf8')
    : null;
}

const { index, items } = buildRegistry(pkg, (path) => {
  try {
    return read(path);
  } catch {
    // A folder, not a file.
    return null;
  }
});

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
await Bun.write(join(out, 'index.json'), `${JSON.stringify(index)}\n`);
for (const item of items) {
  await Bun.write(join(out, `${item.name}.json`), `${JSON.stringify(item)}\n`);
}
console.log(`registry ${index.version}: ${items.length} items → ${out}`);
