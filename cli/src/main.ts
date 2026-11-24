// omuk: copies Omuk UI components into an app, one at a time, as source the
// app owns. It reads the registry the site serves (ui.omuk.dev/r, made by
// scripts/registry.ts in the kit) and keeps its settings in omuk.json.
//
//   omuk init                 omuk.json, and the theme (tokens and fonts)
//   omuk add button dialog    the components, the files they need, their npm packages
//   omuk list                 every component, and which ones the app has
//
// Node built-ins and fetch only, so it runs with npx and bunx alike.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { closest, type Item, plan } from './plan';

const CONFIG = 'omuk.json';
const DEFAULT_REGISTRY = 'https://ui.omuk.dev/r';

type Config = {
  /** Where the registry is: a URL, or a folder (for working on the kit). */
  registry: string;
  /** The app's folder for Omuk UI's files, from the app's root. */
  dir: string;
  /** Each component added, with the registry version it came from. */
  components: Record<string, string>;
  /**
   * Each file omuk wrote, by its path in `dir`, with a hash of its text:
   * a file that still matches was never changed by the app, so a later
   * `add` may update it; one that differs is the app's own and is kept.
   */
  files: Record<string, string>;
};

type Index = {
  version: string;
  items: { name: string; files: string[]; dependencies: string[] }[];
};

const HELP = `omuk: add Omuk UI components to your app, as files you own.

  omuk init [--dir <folder>] [--registry <url>]
      Writes omuk.json and copies the theme (design/theme.css, design/fonts.css).
      The folder defaults to src/components/ui (components/ui without src/).

  omuk add <component...> [--overwrite] [--dry-run] [--no-install]
      Copies each component and every file it imports, and installs its npm
      packages. A file you changed is kept unless you pass --overwrite.

  omuk list
      Every component in the registry; the ones you have are marked.
`;

function fail(message: string): never {
  console.error(`omuk: ${message}`);
  process.exit(1);
}

/** The flags and the other words of the command line. */
function parse(args: string[]) {
  const words: string[] = [];
  const flags = new Map<string, string | true>();
  for (let at = 0; at < args.length; at++) {
    const arg = args[at] ?? '';
    if (!arg.startsWith('--')) {
      words.push(arg);
      continue;
    }
    const [key, value] = arg.slice(2).split('=', 2);
    const next = args[at + 1];
    if (value !== undefined) flags.set(key ?? '', value);
    else if ((key === 'dir' || key === 'registry') && next) {
      flags.set(key, next);
      at++;
    } else flags.set(key ?? '', true);
  }
  return { words, flags };
}

function readConfig(): Config {
  if (!existsSync(CONFIG)) fail(`no ${CONFIG} here. Run \`omuk init\` first.`);
  const config: Config = JSON.parse(readFileSync(CONFIG, 'utf8'));
  config.files ??= {};
  config.components ??= {};
  return config;
}

function hash(text: string) {
  return createHash('sha256').update(text).digest('hex').slice(0, 16);
}

function writeConfig(config: Config) {
  writeFileSync(CONFIG, `${JSON.stringify(config, null, 2)}\n`);
}

/** A registry file: fetched from a URL, or read from a folder. */
async function fetchJson<T>(registry: string, file: string): Promise<T> {
  if (!/^https?:\/\//.test(registry)) {
    const path = join(registry, file);
    if (!existsSync(path)) fail(`${path} is missing.`);
    return JSON.parse(readFileSync(path, 'utf8'));
  }
  const url = `${registry.replace(/\/$/, '')}/${file}`;
  const response = await fetch(url).catch(() => null);
  if (!response?.ok)
    fail(`could not read ${url} (${response?.status ?? 'offline'}).`);
  return (await response.json()) as T;
}

/** The packages the app lists in its package.json. */
function installedPackages(): Set<string> {
  if (!existsSync('package.json')) return new Set();
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);
}

/** The app's package manager, by its lock file. */
function installCommand(packages: string[]): string[] {
  if (existsSync('bun.lock') || existsSync('bun.lockb')) {
    return ['bun', 'add', ...packages];
  }
  if (existsSync('pnpm-lock.yaml')) return ['pnpm', 'add', ...packages];
  if (existsSync('yarn.lock')) return ['yarn', 'add', ...packages];
  return ['npm', 'install', ...packages];
}

/** Copies the items into the app; returns false when nothing could be done. */
async function copy(
  config: Config,
  names: string[],
  flags: Map<string, string | true>,
) {
  const index = await fetchJson<Index>(config.registry, 'index.json');
  const known = index.items.map((item) => item.name);
  for (const name of names) {
    if (known.includes(name)) continue;
    const near = closest(name, known);
    fail(
      `there is no component "${name}".${near.length ? ` Did you mean ${near.join(', ')}?` : ' Run `omuk list`.'}`,
    );
  }
  const items = await Promise.all(
    names.map((name) => fetchJson<Item>(config.registry, `${name}.json`)),
  );
  const result = plan(
    items,
    (path) => {
      const full = join(config.dir, path);
      return existsSync(full) ? readFileSync(full, 'utf8') : null;
    },
    (path, current) => config.files[path] === hash(current),
    installedPackages(),
    flags.has('overwrite'),
  );
  const dry = flags.has('dry-run');

  for (const [files, done, would] of [
    [result.write, 'wrote     ', 'would write  '],
    [result.update, 'updated   ', 'would update '],
  ] as const) {
    for (const file of files) {
      const full = join(config.dir, file.path);
      console.log(`${dry ? would : done} ${full}`);
      if (dry) continue;
      mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, file.content);
      config.files[file.path] = hash(file.content);
    }
  }
  for (const path of result.same) {
    console.log(`same       ${join(config.dir, path)}`);
    // Written by hand or by an older omuk: the same text, so it is ours.
    if (!dry)
      config.files[path] ??= hash(readFileSync(join(config.dir, path), 'utf8'));
  }
  for (const path of result.kept) {
    console.log(
      `kept       ${join(config.dir, path)} (you changed it; --overwrite replaces it)`,
    );
  }

  if (result.install.length > 0) {
    const command = installCommand(result.install);
    if (dry || flags.has('no-install')) {
      console.log(`\nInstall: ${command.join(' ')}`);
    } else {
      console.log(`\n${command.join(' ')}`);
      const run = spawnSync(command[0] ?? 'npm', command.slice(1), {
        stdio: 'inherit',
        shell: process.platform === 'win32',
      });
      if (run.status !== 0) fail('installing the packages failed.');
    }
  }

  if (!dry) {
    for (const name of names) config.components[name] = index.version;
    writeConfig(config);
  }
}

async function init(flags: Map<string, string | true>) {
  if (existsSync(CONFIG)) fail(`${CONFIG} is already here.`);
  const dirFlag = flags.get('dir');
  const registryFlag = flags.get('registry');
  const config: Config = {
    registry:
      typeof registryFlag === 'string' ? registryFlag : DEFAULT_REGISTRY,
    dir:
      typeof dirFlag === 'string'
        ? dirFlag
        : existsSync('src')
          ? 'src/components/ui'
          : 'components/ui',
    components: {},
    files: {},
  };
  writeConfig(config);
  console.log(`wrote      ${CONFIG}`);
  await copy(config, ['theme'], flags);
  const design = relative('.', resolve(config.dir, 'design'));
  console.log(`
Add these lines to your Tailwind stylesheet, after @import "tailwindcss"
(paths from that file):

  @import "<path to>/${design}/theme.css";
  @import "<path to>/${design}/fonts.css";

Then add a component: omuk add button`);
}

async function list() {
  const config = readConfig();
  const index = await fetchJson<Index>(config.registry, 'index.json');
  console.log(`Omuk UI ${index.version}\n`);
  for (const item of index.items) {
    const have = config.components[item.name];
    const mark = have ? `✓ ${have}` : '';
    console.log(`  ${item.name.padEnd(16)} ${mark}`);
  }
}

async function main() {
  const { words, flags } = parse(process.argv.slice(2));
  const [command, ...names] = words;
  if (!command || flags.has('help') || command === 'help') {
    console.log(HELP);
    return;
  }
  if (command === 'init') return init(flags);
  if (command === 'list') return list();
  if (command === 'add') {
    if (names.length === 0) fail('name a component: omuk add button');
    return copy(readConfig(), names, flags);
  }
  fail(`unknown command "${command}". Run \`omuk help\`.`);
}

await main();
