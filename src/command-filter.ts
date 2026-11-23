// The command menu's search (command.tsx), without React: which items match
// a query, in which order, under which group. Kept apart so a test can
// check it.

/** What the search reads from an item. */
export type Searchable = {
  id: string;
  label: string;
  group?: string;
  description?: string;
  keywords?: string[];
};

/** A group's title (none for items without one) and its matching items. */
export type CommandSection<T> = { group: string | undefined; items: T[] };

/**
 * How well an item matches, lower is better; null for no match. The label
 * counts most: its start, then the start of a word in it, then anywhere.
 * A keyword or the description matches last.
 */
export function rank(item: Searchable, query: string): number | null {
  const needle = query.trim().toLowerCase();
  if (needle === '') return 0;
  const label = item.label.toLowerCase();
  if (label.startsWith(needle)) return 0;
  if (label.includes(` ${needle}`)) return 1;
  if (label.includes(needle)) return 2;
  if (item.keywords?.some((word) => word.toLowerCase().includes(needle))) {
    return 3;
  }
  if (item.description?.toLowerCase().includes(needle)) return 4;
  return null;
}

/**
 * The items that match, in their groups. Groups keep the order of their
 * first item in `items`; inside a group, better matches come first and
 * equal ones keep their order. An empty query keeps every item.
 */
export function filterCommands<T extends Searchable>(
  items: readonly T[],
  query: string,
): CommandSection<T>[] {
  const sections: (CommandSection<T> & { ranks: number[] })[] = [];
  for (const item of items) {
    const score = rank(item, query);
    if (score === null) continue;
    let section = sections.find((each) => each.group === item.group);
    if (!section) {
      section = { group: item.group, items: [], ranks: [] };
      sections.push(section);
    }
    section.items.push(item);
    section.ranks.push(score);
  }
  return sections.map(({ group, items: found, ranks }) => ({
    group,
    items: found
      .map((item, index) => ({ item, score: ranks[index] ?? 0, index }))
      .sort((a, b) => a.score - b.score || a.index - b.index)
      .map(({ item }) => item),
  }));
}
