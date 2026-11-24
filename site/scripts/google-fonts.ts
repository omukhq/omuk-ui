// Writes public/google-fonts.json: the Google Fonts families the settings
// drawer's font picker offers. Run it by hand to refresh the list
// (`bun run fonts`); the file is committed, so a build needs no network.
//
// Each family is [name, category, weights]: the weights to ask for, as
// Google's css2 API takes them ("400;500;600"). Only families with Latin
// letters (the site is in English), most popular first. Google's own list
// (fonts.google.com/metadata/fonts) needs no API key.

const SOURCE = 'https://fonts.google.com/metadata/fonts';
const OUT = new URL('../public/google-fonts.json', import.meta.url);

/** The weights the interface uses: text, medium, semibold. */
const WANTED = [400, 500, 600];

type Family = {
  family: string;
  category: string;
  subsets: string[];
  fonts: Record<string, unknown>;
  axes: { tag: string; min: number; max: number }[];
  popularity: number;
};

/** The weights to load: the wanted ones the family has, else its nearest. */
function weightsOf(family: Family): string {
  const weight = family.axes.find((axis) => axis.tag === 'wght');
  const has = weight
    ? (value: number) => value >= weight.min && value <= weight.max
    : (value: number) => String(value) in family.fonts;
  const found = WANTED.filter(has);
  if (found.length > 0) return found.join(';');
  // A display face with one weight (often 400, sometimes not).
  const upright = Object.keys(family.fonts)
    .filter((key) => /^\d+$/.test(key))
    .map(Number)
    .sort((a, b) => Math.abs(a - 400) - Math.abs(b - 400));
  return String(upright[0] ?? 400);
}

const response = await fetch(SOURCE);
if (!response.ok) throw new Error(`${SOURCE}: ${response.status}`);
const { familyMetadataList: families } = (await response.json()) as {
  familyMetadataList: Family[];
};

const list = families
  .filter((family) => family.subsets.includes('latin'))
  .sort((a, b) => a.popularity - b.popularity)
  .map((family) => [family.family, family.category, weightsOf(family)]);

await Bun.write(OUT, `${JSON.stringify(list)}\n`);
console.log(`${list.length} families → ${OUT.pathname}`);
