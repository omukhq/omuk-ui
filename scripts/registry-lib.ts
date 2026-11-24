// The registry: what `omuk add <name>` copies into an app (cli/). One item
// per component the package exports, made from the same src/ files the npm
// package ships. An item holds every file the component reaches through its
// relative imports, at its path under src/, so the copies import each other
// unchanged; and the npm packages those files import, at the versions the
// kit itself uses.

import { dirname, join, normalize } from 'node:path';

export type RegistryFile = { path: string; content: string };

export type RegistryItem = {
  name: string;
  /** The files to copy, paths relative to the app's component folder. */
  files: RegistryFile[];
  /** npm packages to install: name → version range. */
  dependencies: Record<string, string>;
};

export type RegistryIndex = {
  version: string;
  items: { name: string; files: string[]; dependencies: string[] }[];
};

/** Reads one file of src/ by its path there ("button.tsx"). */
export type ReadFile = (path: string) => string | null;

const IMPORT =
  /(?:import|export)\s[^'"]*?from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]|@import\s+['"]([^'"]+)['"]/g;

/**
 * The text without comments: block comments, and lines that start with
 * `//`. (A `//` later in a line may be inside a string, such as a URL.)
 */
function withoutComments(content: string) {
  return content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** The specifiers a file imports (JS and CSS), comments aside. */
export function importsOf(content: string): string[] {
  const found: string[] = [];
  for (const match of withoutComments(content).matchAll(IMPORT)) {
    const specifier = match[1] ?? match[2] ?? match[3];
    if (specifier) found.push(specifier);
  }
  return found;
}

/** The npm package of a bare specifier: "@scope/name/x" → "@scope/name". */
export function packageOf(specifier: string): string {
  const parts = specifier.split('/');
  return specifier.startsWith('@')
    ? parts.slice(0, 2).join('/')
    : (parts[0] ?? specifier);
}

/** Packages an app has already: the kit's peers and the runtime's own. */
const PROVIDED = new Set(['react', 'react-dom', 'tailwindcss', 'bun']);

const EXTENSIONS = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];

/**
 * One item: the entry file and every file it reaches, and their npm
 * packages. `versions` gives each package's range (the kit's package.json).
 */
export function itemFor(
  name: string,
  entry: string,
  read: ReadFile,
  versions: Record<string, string>,
): RegistryItem {
  const files = new Map<string, string>();
  const packages = new Set<string>();
  const queue = [entry];
  while (queue.length > 0) {
    const path = queue.shift();
    if (path === undefined || files.has(path)) continue;
    const content = read(path);
    if (content === null) throw new Error(`${name}: ${path} is missing`);
    files.set(path, content);
    for (const specifier of importsOf(content)) {
      if (specifier.startsWith('.')) {
        const base = normalize(join(dirname(path), specifier));
        const found = EXTENSIONS.map((ext) => base + ext).find(
          (candidate) => read(candidate) !== null,
        );
        if (!found) throw new Error(`${path}: cannot find ${specifier}`);
        queue.push(found);
      } else {
        const pkg = packageOf(specifier);
        if (!PROVIDED.has(pkg) && !pkg.startsWith('node:')) packages.add(pkg);
      }
    }
  }
  const dependencies: Record<string, string> = {};
  for (const pkg of [...packages].sort()) {
    const version = versions[pkg];
    if (!version) throw new Error(`${name}: ${pkg} is not in package.json`);
    dependencies[pkg] = version;
  }
  return {
    name,
    files: [...files]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, content]) => ({ path, content })),
    dependencies,
  };
}

/** Exports that are not components to copy. */
const NOT_ITEMS = new Set(['token-check']);

/**
 * Every item: one per component export of package.json, and `theme` (the
 * tokens and the fonts, which `omuk init` copies).
 */
export function buildRegistry(
  pkg: {
    version: string;
    exports: Record<string, string>;
    dependencies: Record<string, string>;
  },
  read: ReadFile,
): { index: RegistryIndex; items: RegistryItem[] } {
  const items: RegistryItem[] = [];
  for (const [key, target] of Object.entries(pkg.exports)) {
    const name = key.replace(/^\.\//, '');
    if (NOT_ITEMS.has(name) || !target.startsWith('./src/')) continue;
    items.push(
      itemFor(name, target.slice('./src/'.length), read, pkg.dependencies),
    );
  }
  const theme = itemFor('theme', 'design/theme.css', read, pkg.dependencies);
  const fonts = itemFor('fonts', 'design/fonts.css', read, pkg.dependencies);
  items.push({
    name: 'theme',
    files: [...theme.files, ...fonts.files],
    dependencies: { ...theme.dependencies, ...fonts.dependencies },
  });
  items.sort((a, b) => a.name.localeCompare(b.name));
  return {
    index: {
      version: pkg.version,
      items: items.map((item) => ({
        name: item.name,
        files: item.files.map((file) => file.path),
        dependencies: Object.keys(item.dependencies),
      })),
    },
    items,
  };
}
