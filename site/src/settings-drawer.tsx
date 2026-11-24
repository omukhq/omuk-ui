import { Button } from '@omuk/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@omuk/ui/combobox';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@omuk/ui/drawer';
import { Segmented, SegmentedItem } from '@omuk/ui/segmented';
import { cn } from '@omuk/ui/utils';
import { type ReactNode, useId, useState } from 'react';
import {
  type GoogleFont,
  loadGoogleFonts,
  previewGoogleFont,
  setGoogleFont,
  useGoogleFont,
} from './google-font';
import { resetSettings, setSetting, useSetting } from './settings';
import { setTheme, type ThemeChoice, useThemeChoice } from './theme';
import { SETTINGS, type SettingName, type SettingValue } from './theme-script';

// The site's settings: Omuk UI's tokens, picked live. Each pick changes a
// token on <html> (tokens.css), so the whole site and every example follow,
// and stays in this browser. The header loads this file on the first open.

/** The swatch of each accent: the light page's shade. */
const SWATCH: Record<SettingValue<'accent'>, string> = {
  blue: 'bg-blue-600',
  violet: 'bg-violet-600',
  green: 'bg-green-700',
  amber: 'bg-amber-700',
  pink: 'bg-pink-600',
};

/** What each value is called on screen. */
const LABELS: { [Name in SettingName]: Record<SettingValue<Name>, string> } = {
  accent: {
    blue: 'Blue',
    violet: 'Violet',
    green: 'Green',
    amber: 'Amber',
    pink: 'Pink',
  },
  font: {
    plex: 'IBM Plex',
    atkinson: 'Atkinson',
    system: 'System',
    google: 'Google',
  },
  edge: { regular: 'Regular', thin: 'Thin' },
  density: {
    compact: 'Compact',
    regular: 'Regular',
    comfortable: 'Roomy',
  },
};

const THEMES: { value: ThemeChoice; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

/** A setting's name, the token it sets, and its choices. */
function Row({
  label,
  token,
  children,
}: {
  label: string;
  token: string;
  children: (labelId: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span id={id} className="text-sm font-medium text-foreground">
          {label}
        </span>
        <code className="font-mono text-xs text-muted">{token}</code>
      </div>
      {children(id)}
    </div>
  );
}

/** One setting as a segmented control, its values in the order shown. */
function Choice<Name extends SettingName>({
  name,
  order,
  labelId,
}: {
  name: Name;
  order: readonly SettingValue<Name>[];
  labelId: string;
}) {
  const value = useSetting(name);
  const labels: Record<string, string> = LABELS[name];
  return (
    <Segmented
      aria-labelledby={labelId}
      // A value with no segment (a Google font): none is chosen.
      value={order.includes(value) ? value : null}
      onValueChange={(next) => {
        const picked = order.find((option) => option === next);
        if (picked) setSetting(name, picked);
      }}
      className="w-full"
    >
      {order.map((option) => (
        <SegmentedItem key={option} value={option} className="flex-1">
          {labels[option]}
        </SegmentedItem>
      ))}
    </Segmented>
  );
}

function AccentChoice({ labelId }: { labelId: string }) {
  const value = useSetting('accent');
  return (
    <Segmented
      aria-labelledby={labelId}
      value={value}
      onValueChange={(next) => {
        const picked = SETTINGS.accent.values.find((option) => option === next);
        if (picked) setSetting('accent', picked);
      }}
      className="w-full"
    >
      {SETTINGS.accent.values.map((option) => (
        <SegmentedItem
          key={option}
          value={option}
          aria-label={LABELS.accent[option]}
          title={LABELS.accent[option]}
          className="flex-1"
        >
          <span className={cn('size-4 rounded-full', SWATCH[option])} />
        </SegmentedItem>
      ))}
    </Segmented>
  );
}

/** Rows drawn at first, and added each time the list nears its end. */
const PAGE = 50;

/** One family, its name drawn in its own face (loaded as the row shows). */
function FontRow({ font }: { font: GoogleFont }) {
  const [family, category] = font;
  return (
    <ComboboxItem
      value={font}
      ref={() => previewGoogleFont(font)}
      // The arrow keys find the highlighted row's font by this.
      data-family={family}
      className="gap-3"
    >
      <span
        className="min-w-0 flex-1 truncate"
        style={{ fontFamily: `"${family}", var(--font-sans)` }}
      >
        {family}
      </span>
      <span className="ml-auto shrink-0 text-xs text-muted">{category}</span>
    </ComboboxItem>
  );
}

/** Puts a Google font on the whole site, and keeps it. */
function showFont(font: GoogleFont) {
  setGoogleFont(font);
  setSetting('font', 'google');
}

/** The keys that move the highlight in the list. */
const MOVES = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End']);

/**
 * Any Google font: the list loads on the first hover, focus or open of the
 * field, and a row's preview as the row shows. The list stays open after a
 * pick, so fonts can be tried one after another; the arrow keys put the
 * highlighted font on the site at once. A press outside or Escape closes it.
 */
function GoogleFontPicker() {
  const font = useSetting('font');
  const kept = useGoogleFont();
  const current = font === 'google' ? kept : null;
  const [fonts, setFonts] = useState<GoogleFont[] | null>(null);
  const [failed, setFailed] = useState(false);
  // How many rows show: one page more each time the list nears its end.
  const [shown, setShown] = useState(PAGE);
  // While open, the field's value is the last font picked with Enter or a
  // press, not the one the arrows reached: a new value would put its name
  // in the field and drop the search.
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<GoogleFont | null>(null);

  /** After the list moved its highlight: that row's font, on the site. */
  function followHighlight(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !fonts || !MOVES.has(event.key)) return;
    const input = event.currentTarget;
    requestAnimationFrame(() => {
      const id = input.getAttribute('aria-activedescendant');
      const row = id ? document.getElementById(id) : null;
      const reached = fonts.find(([family]) => family === row?.dataset.family);
      if (reached) showFont(reached);
    });
  }

  function load() {
    if (fonts) return;
    setFailed(false);
    loadGoogleFonts().then(setFonts, () => setFailed(true));
  }

  /** Within half a list's height of the end: the next page. */
  function more(event: React.UIEvent<HTMLDivElement>) {
    const list = event.currentTarget;
    const left = list.scrollHeight - list.scrollTop - list.clientHeight;
    if (left < list.clientHeight / 2) setShown((count) => count + PAGE);
  }

  return (
    <Combobox<GoogleFont>
      items={fonts ?? []}
      value={open ? picked : current}
      onValueChange={(next) => {
        if (!next) return;
        setPicked(next);
        showFont(next);
      }}
      onOpenChange={(next, change) => {
        // A pick keeps the list open; a press outside or Escape closes it.
        if (!next && change.reason === 'item-press') {
          change.cancel();
          return;
        }
        if (next) {
          load();
          setPicked(current);
        }
        setOpen(next);
      }}
      // A new search starts at the first page again.
      onInputValueChange={(_, change) => {
        if (change.reason === 'input-change') setShown(PAGE);
      }}
      itemToStringLabel={(item) => item[0]}
      isItemEqualToValue={(item, value) => item[0] === value[0]}
    >
      <ComboboxInput
        aria-label="Google font"
        placeholder="Any Google font"
        className="w-full"
        onPointerEnter={load}
        onFocus={load}
        onKeyDown={followHighlight}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {fonts
            ? 'No font has that name.'
            : failed
              ? 'The font list did not load. Open it again to retry.'
              : 'Loading the font list…'}
        </ComboboxEmpty>
        <ComboboxList onScroll={more}>
          {(item: GoogleFont, index: number) =>
            index < shown ? <FontRow key={item[0]} font={item} /> : null
          }
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function ThemeChoiceRow({ labelId }: { labelId: string }) {
  const value = useThemeChoice();
  return (
    <Segmented
      aria-labelledby={labelId}
      value={value}
      onValueChange={(next) => {
        const picked = THEMES.find((theme) => theme.value === next);
        if (picked) setTheme(picked.value);
      }}
      className="w-full"
    >
      {THEMES.map((theme) => (
        <SegmentedItem key={theme.value} value={theme.value} className="flex-1">
          {theme.label}
        </SegmentedItem>
      ))}
    </Segmented>
  );
}

export default function SettingsDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-y-auto scrollbar-subtle">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Try Omuk UI&rsquo;s tokens on this site. Each one changes every
            example, and stays in this browser.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-6 px-4 pb-4">
          <Row label="Theme" token="data-theme">
            {(id) => <ThemeChoiceRow labelId={id} />}
          </Row>
          <Row label="Accent" token="--color-accent">
            {(id) => <AccentChoice labelId={id} />}
          </Row>
          <Row label="Font" token="--font-sans">
            {(id) => (
              <>
                <Choice
                  name="font"
                  order={['plex', 'atkinson', 'system']}
                  labelId={id}
                />
                <GoogleFontPicker />
                <p className="text-xs text-muted">
                  A Google font loads from Google&rsquo;s servers, which see
                  your IP address.
                </p>
              </>
            )}
          </Row>
          <Row label="Edges" token="--edge-control">
            {(id) => (
              <Choice name="edge" order={SETTINGS.edge.values} labelId={id} />
            )}
          </Row>
          <Row label="Spacing" token="--spacing">
            {(id) => (
              <Choice
                name="density"
                order={['compact', 'regular', 'comfortable']}
                labelId={id}
              />
            )}
          </Row>
        </div>
        <DrawerFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetSettings();
              setGoogleFont(null);
              setTheme('system');
            }}
          >
            Reset to the kit&rsquo;s own
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
