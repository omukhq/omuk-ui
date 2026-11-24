// What `omuk add` does to the app's files, worked out before it touches
// any: pure, so it is tested without a disk.

export type ItemFile = { path: string; content: string };

export type Item = {
  name: string;
  files: ItemFile[];
  dependencies: Record<string, string>;
};

export type Plan = {
  /** New files. */
  write: ItemFile[];
  /** Files the app never changed, with a newer text: replaced. */
  update: ItemFile[];
  /** Files already there with the same text. */
  same: string[];
  /** Files the app changed since omuk wrote them: kept. */
  kept: string[];
  /** npm packages the app does not have yet: name@range. */
  install: string[];
};

/**
 * The plan for these items. `onDisk` gives a file's text in the app's
 * component folder, or null; `untouched` says whether that text is still
 * what omuk wrote (its hash in omuk.json); `installed` the packages the
 * app has. `overwrite` replaces the app's changes too.
 */
export function plan(
  items: Item[],
  onDisk: (path: string) => string | null,
  untouched: (path: string, current: string) => boolean,
  installed: Set<string>,
  overwrite: boolean,
): Plan {
  const files = new Map<string, string>();
  for (const item of items) {
    for (const file of item.files) files.set(file.path, file.content);
  }
  const result: Plan = {
    write: [],
    update: [],
    same: [],
    kept: [],
    install: [],
  };
  for (const [path, content] of [...files].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const current = onDisk(path);
    if (current === null) result.write.push({ path, content });
    else if (current === content) result.same.push(path);
    else if (overwrite || untouched(path, current)) {
      result.update.push({ path, content });
    } else result.kept.push(path);
  }
  const packages = new Map<string, string>();
  for (const item of items) {
    for (const [name, range] of Object.entries(item.dependencies)) {
      if (!installed.has(name)) packages.set(name, range);
    }
  }
  result.install = [...packages]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, range]) => `${name}@${range}`);
  return result;
}

/** The closest names to a mistyped one, for "did you mean". */
export function closest(name: string, names: string[]): string[] {
  return names
    .map((candidate) => ({ candidate, score: distance(name, candidate) }))
    .filter(({ score }) => score <= Math.max(2, name.length / 3))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}

/** Levenshtein distance: the edits from one word to the other. */
function distance(a: string, b: string): number {
  let row = Array.from({ length: b.length + 1 }, (_, at) => at);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(
        (row[j] ?? 0) + 1,
        (next[j - 1] ?? 0) + 1,
        (row[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    row = next;
  }
  return row[b.length] ?? 0;
}
