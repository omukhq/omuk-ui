// Moves every app that uses Omuk UI to a released version, after the tag is
// pushed (README, "Versions"). Run it from this repo:
//
//   bun scripts/update-apps.ts             the version in package.json
//   bun scripts/update-apps.ts --dry-run   only says what it would do
//   bun scripts/update-apps.ts --version 1.0.0-alpha.30 --only secrets,markpad
//   bun scripts/update-apps.ts --to-npm    installs from npm, not a GitHub tag
//
// With --to-npm, an app's GitHub spec becomes the npm alias
// `"@omuk/ui": "npm:@omukhq/ui@<version>"`, so its imports (`@omuk/ui/button`)
// and its CSS paths (`node_modules/@omuk/ui/…`) stay as they are. The version
// must be on npm. An app on the alias stays on it in later runs.
//
// It finds the apps on this machine: every package.json under `root` that
// depends on @omuk/ui or @omukhq/ui. The list of apps is the owner's, not
// this public repo's, so it lives in ~/.config/omuk-ui/apps.json (or the
// file in OMUK_APPS):
//
//   { "root": "~/codes", "skip": ["old-app"], "checks": { "markpad": "bun run check:push" } }
//
// For each repo it:
//   1. skips it when it has uncommitted changes, is not on its main branch,
//      or is already on the version;
//   2. makes a branch, chore/omuk-ui-<version>, sets the version in each
//      package.json (in its own form), and runs `bun install`;
//   3. runs the repo's checks (`bun run check`, or the config's command);
//   4. commits, then on GitHub pushes and opens a pull request: a draft when
//      the checks fail. The body holds the changelog since the app's
//      version, with its "To update" steps. A repo on another remote keeps
//      the branch on this machine.
//
// It merges nothing: a release before 1.0.0 can break the API, and most apps
// have no CI to catch it, so the owner reads each pull request.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, relative } from 'node:path';
import {
  bumpPackageJson,
  changelogBetween,
  isOlder,
  NPM_PACKAGE,
  specsIn,
  versionOf,
} from './update-apps-lib';

type Config = {
  /** The folder to look for apps in. */
  root: string;
  /** Repos to leave alone, by folder name. */
  skip?: string[];
  /** A repo's own check command, by folder name. */
  checks?: Record<string, string>;
};

type Result = { repo: string; outcome: string; link?: string };

const kit = join(import.meta.dir, '..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const toNpm = args.includes('--to-npm');

/** The value after a flag, as in `--version 1.0.0`. */
function flag(name: string) {
  const at = args.indexOf(name);
  return at === -1 ? undefined : args[at + 1];
}

function home(path: string) {
  return path.startsWith('~/') ? join(homedir(), path.slice(2)) : path;
}

/** Runs a command; its output and whether it worked. */
function run(command: string[], cwd: string) {
  const result = Bun.spawnSync(command, {
    cwd,
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const output = `${result.stdout.toString()}${result.stderr.toString()}`;
  return { ok: result.exitCode === 0, output };
}

function git(cwd: string, ...command: string[]) {
  return run(['git', ...command], cwd);
}

/** Every package.json under `dir` that installs Omuk UI. */
function findApps(dir: string, depth = 0): string[] {
  if (depth > 6) return [];
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...findApps(path, depth + 1));
    else if (entry.name === 'package.json') {
      const specs = specsIn(readFileSync(path, 'utf8'));
      if (specs.some((spec) => versionOf(spec) !== null)) found.push(path);
    }
  }
  return found;
}

/** The repo's main branch: origin's HEAD, else main. */
function mainBranch(repo: string) {
  const head = git(repo, 'symbolic-ref', '--short', 'refs/remotes/origin/HEAD');
  return head.ok ? head.output.trim().replace(/^origin\//, '') : 'main';
}

/** The folders to run `bun install` in: each one with a bun.lock. */
function lockFolders(repo: string, files: string[]) {
  const folders = new Set<string>();
  for (const file of files) {
    let dir = dirname(file);
    while (
      !existsSync(join(dir, 'bun.lock')) &&
      dir.startsWith(repo) &&
      dir !== repo
    ) {
      dir = dirname(dir);
    }
    folders.add(dir);
  }
  return [...folders];
}

/** The repo's check command: the config's, else `bun run check`. */
function checkCommand(repo: string, config: Config) {
  const own = config.checks?.[basename(repo)];
  if (own) return own.split(' ');
  const pkg = join(repo, 'package.json');
  const scripts = existsSync(pkg)
    ? (JSON.parse(readFileSync(pkg, 'utf8')).scripts ?? {})
    : {};
  if (scripts.check) return ['bun', 'run', 'check'];
  if (scripts.test) return ['bun', 'run', 'test'];
  return null;
}

function updateRepo(
  repo: string,
  files: string[],
  version: string,
  config: Config,
): Result {
  const name = basename(repo);
  const branch = `chore/omuk-ui-${version}`;
  const specs = files.flatMap((file) => specsIn(readFileSync(file, 'utf8')));
  const oldest = specs
    .map(versionOf)
    .filter((each): each is string => each !== null)
    .sort((a, b) => (isOlder(a, b) ? -1 : 1))[0];
  // With --to-npm, a GitHub spec still moves, also on the same version.
  const fromGitHub = specs.some((spec) => /#v[\w.-]+$/.test(spec));
  if (!oldest || (!isOlder(oldest, version) && !(toNpm && fromGitHub))) {
    return { repo: name, outcome: `already on ${oldest ?? version}` };
  }
  if (git(repo, 'status', '--porcelain').output.trim()) {
    return { repo: name, outcome: 'skipped: uncommitted changes' };
  }
  const main = mainBranch(repo);
  const current = git(repo, 'branch', '--show-current').output.trim();
  if (current !== main) {
    return { repo: name, outcome: `skipped: on ${current}, not ${main}` };
  }
  if (git(repo, 'rev-parse', '--verify', '--quiet', branch).ok) {
    return { repo: name, outcome: `skipped: ${branch} already exists` };
  }
  const where = files.map((file) => relative(repo, file)).join(', ');
  const source = toNpm ? ` from npm (${NPM_PACKAGE})` : '';
  if (dryRun) {
    return {
      repo: name,
      outcome: `would move ${oldest} → ${version}${source} in ${where}`,
    };
  }

  git(repo, 'switch', '-c', branch);
  for (const file of files) {
    writeFileSync(
      file,
      bumpPackageJson(readFileSync(file, 'utf8'), version, toNpm),
    );
  }
  for (const folder of lockFolders(repo, files)) {
    const install = run(['bun', 'install'], folder);
    if (!install.ok) {
      git(repo, 'checkout', '--', '.');
      git(repo, 'switch', main);
      git(repo, 'branch', '-D', branch);
      return {
        repo: name,
        outcome: `install failed: ${install.output.trim().split('\n').at(-1)}`,
      };
    }
  }

  const command = checkCommand(repo, config);
  const check = command
    ? run(command, repo)
    : { ok: true, output: 'no check script' };
  const checks = command
    ? check.ok
      ? `\`${command.join(' ')}\` passes.`
      : `\`${command.join(' ')}\` fails:\n\n\`\`\`\n${check.output.trim().split('\n').slice(-30).join('\n')}\n\`\`\``
    : 'The repo has no check script.';

  git(repo, 'add', '-A');
  git(
    repo,
    'commit',
    '-m',
    `Omuk UI ${version}`,
    '-m',
    `From ${oldest}. ${check.ok ? 'The checks pass.' : 'The checks fail: see the pull request, and the changelog\'s "To update" steps.'}`,
  );

  const remote = git(repo, 'remote', 'get-url', 'origin');
  const onGitHub = remote.ok && /github\.com/.test(remote.output);
  let result: Result;
  if (!onGitHub) {
    result = {
      repo: name,
      outcome: `${check.ok ? 'checks pass' : 'CHECKS FAIL'}; branch ${branch} kept on this machine (remote is not GitHub)`,
    };
  } else {
    const push = git(repo, 'push', '-u', 'origin', branch);
    if (!push.ok) {
      result = {
        repo: name,
        outcome: `committed on ${branch}, but the push failed: ${push.output.trim().split('\n').at(-1)}`,
      };
    } else {
      const changelog = changelogBetween(
        readFileSync(join(kit, 'CHANGELOG.md'), 'utf8'),
        oldest,
        version,
      );
      const body = `Moves Omuk UI from ${oldest} to ${version} (${where}).\n\n## Checks\n\n${checks}\n\n## What changed in Omuk UI\n\nRead each "Changed (breaking)" item and its "To update" step.\n\n${changelog}`;
      const pr = run(
        [
          'gh',
          'pr',
          'create',
          '--base',
          main,
          '--head',
          branch,
          '--title',
          `Omuk UI ${version}`,
          '--body',
          body,
          ...(check.ok ? [] : ['--draft']),
        ],
        repo,
      );
      result = {
        repo: name,
        outcome: pr.ok
          ? check.ok
            ? 'pull request open, checks pass'
            : 'DRAFT pull request, checks fail'
          : `pushed ${branch}, but the pull request failed`,
        link: pr.ok ? pr.output.trim().split('\n').at(-1) : undefined,
      };
    }
  }
  git(repo, 'switch', main);
  return result;
}

function main() {
  const version =
    flag('--version') ??
    JSON.parse(readFileSync(join(kit, 'package.json'), 'utf8')).version;
  const tag = `v${version}`;
  if (!git(kit, 'ls-remote', '--exit-code', '--tags', 'origin', tag).ok) {
    console.error(
      `${tag} is not on GitHub yet: push the tag first (README, "Versions").`,
    );
    process.exit(1);
  }
  if (toNpm) {
    const published = run(
      ['bun', 'info', `${NPM_PACKAGE}@${version}`, 'version'],
      kit,
    );
    if (!published.ok || !published.output.includes(version)) {
      console.error(
        `${NPM_PACKAGE}@${version} is not on npm yet: run \`bun publish\` first.`,
      );
      process.exit(1);
    }
  }
  const configPath = home(
    process.env.OMUK_APPS ?? '~/.config/omuk-ui/apps.json',
  );
  if (!existsSync(configPath)) {
    console.error(
      `No ${configPath}. Make it, for example: { "root": "~/codes", "skip": [] }`,
    );
    process.exit(1);
  }
  const config: Config = JSON.parse(readFileSync(configPath, 'utf8'));
  const only = flag('--only')?.split(',');

  // Each app's package.json files, by repo.
  const repos = new Map<string, string[]>();
  for (const file of findApps(home(config.root))) {
    const top = git(dirname(file), 'rev-parse', '--show-toplevel');
    if (!top.ok) continue;
    const repo = top.output.trim();
    if (repo === kit) continue;
    if (config.skip?.includes(basename(repo))) continue;
    if (only && !only.includes(basename(repo))) continue;
    repos.set(repo, [...(repos.get(repo) ?? []), file]);
  }

  console.log(
    `${dryRun ? 'Dry run: ' : ''}Omuk UI ${version}, ${repos.size} repos\n`,
  );
  const results: Result[] = [];
  for (const [repo, files] of repos) {
    const result = updateRepo(repo, files, version, config);
    results.push(result);
    console.log(
      `${result.repo}: ${result.outcome}${result.link ? `\n  ${result.link}` : ''}`,
    );
  }
  if (results.some((result) => /FAIL|failed/.test(result.outcome)))
    process.exit(1);
}

main();
