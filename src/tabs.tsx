import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ComponentPropsWithRef,
  createContext,
  type KeyboardEvent,
  use,
  useCallback,
  useId,
  useLayoutEffect,
  useState,
} from 'react';
import { mergeProps, type RenderProp, useRender } from './render';
import { cn } from './utils';

// WAI-ARIA tabs: arrow keys move between tabs (and select, the automatic
// activation the design guide asks for), Home and End go to the ends.

type TabValue = unknown;
type Orientation = 'horizontal' | 'vertical';

/** Base UI's `eventDetails` for a tab change, the parts callers read. */
type ValueChangeDetails = { reason: string; event: Event | undefined };

type TabsState = {
  value: TabValue;
  select: (value: TabValue, event?: Event) => void;
  orientation: Orientation;
  id: string;
  /** A tab puts its value here while it is on the page, in page order. */
  register: (value: TabValue, disabled: boolean) => () => void;
};

type Registered = { value: TabValue; disabled: boolean };

const TabsContext = createContext<TabsState | null>(null);

function useTabs() {
  const tabs = use(TabsContext);
  if (!tabs) throw new Error('A tabs part must be inside <Tabs>.');
  return tabs;
}

/** An id for the tab or panel of `value`, the same from either side. */
function partId(tabs: TabsState, part: 'tab' | 'panel', value: TabValue) {
  return `${tabs.id}-${part}-${String(value).replace(/\s+/g, '-')}`;
}

type TabsProps = Omit<ComponentPropsWithRef<'div'>, 'defaultValue'> & {
  value?: TabValue;
  defaultValue?: TabValue;
  onValueChange?: (value: TabValue, eventDetails: ValueChangeDetails) => void;
  orientation?: Orientation;
  render?: RenderProp;
};

function Tabs({
  className,
  orientation = 'horizontal',
  value: controlled,
  defaultValue = 0,
  onValueChange,
  render,
  ...props
}: TabsProps) {
  const [own, setOwn] = useState(defaultValue);
  const [registered, setRegistered] = useState<Registered[]>([]);
  // With no tab of the value (the default 0 with string values), the first
  // tab that is on is selected: a tab list must have one, or it has no Tab
  // stop and no panel (Modern Web Guidance, tabs). The app's own value
  // stays its own.
  const chosen = registered.some((tab) => Object.is(tab.value, own))
    ? own
    : (registered.find((tab) => !tab.disabled)?.value ?? own);
  const value = controlled === undefined ? chosen : controlled;
  const id = useId();
  function select(next: TabValue, event?: Event) {
    if (Object.is(next, value)) return;
    onValueChange?.(next, { reason: 'none', event });
    setOwn(next);
  }
  const register = useCallback((tab: TabValue, disabled: boolean) => {
    const entry = { value: tab, disabled };
    setRegistered((now) => [...now, entry]);
    return () => setRegistered((now) => now.filter((each) => each !== entry));
  }, []);
  return (
    <TabsContext value={{ value, select, orientation, id, register }}>
      {useRender(
        'div',
        {
          'data-slot': 'tabs',
          'data-orientation': orientation,
          className: cn(
            'group/tabs flex gap-2 data-horizontal:flex-col',
            className,
          ),
          ...props,
        },
        render,
      )}
    </TabsContext>
  );
}

// DESIGN.md, section 3. `line` is the design system's tabs: muted labels on
// a `border-b`, the selected one in the text colour over a 2-wide accent
// underline (`border-b-2 border-accent`). Every tab has a transparent 2-wide
// edge above and below, so the label sits where it did and only the colour
// changes; `-mb-px` lays the underline over the list's line. `default` is a
// segmented track (the chosen tab raised), for the places that used the
// root's grey pill.
const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center text-muted group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col',
  {
    variants: {
      variant: {
        default:
          'gap-0.5 rounded-lg bg-hover p-1 group-data-horizontal/tabs:h-8',
        line: 'gap-1 group-data-horizontal/tabs:w-full group-data-horizontal/tabs:justify-start group-data-horizontal/tabs:border-b',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type ListVariant = NonNullable<
  VariantProps<typeof tabsListVariants>['variant']
>;

/** The list's variant, for its tabs to draw the matching selected state. */
const ListVariantContext = createContext<ListVariant>('default');

const TRIGGER: Record<ListVariant, string> = {
  default: 'h-full flex-1 rounded-md px-3 text-foreground',
  line: 'h-8 -mb-px border-y-2 border-transparent px-3',
};

/**
 * An unselected tab's hover, added only to it: on the selected tab the
 * grey fill would cover its raised one (owner, 18 Nov 2026).
 */
const IDLE: Record<ListVariant, string> = {
  default: 'hover:bg-hover',
  line: 'hover:text-foreground',
};

/** The selected tab's look, added only to it (the tab knows). */
const ACTIVE: Record<ListVariant, string> = {
  default: 'bg-raised shadow-sm',
  line: 'border-b-accent text-foreground',
};

/** The tab the key moves to, or none. */
function step(
  tabs: HTMLElement[],
  from: number,
  key: string,
  orientation: Orientation,
  loop: boolean,
) {
  const back = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
  const forward = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
  const last = tabs.length - 1;
  if (key === 'Home') return tabs[0];
  if (key === 'End') return tabs[last];
  if (key !== back && key !== forward) return undefined;
  const next = from + (key === forward ? 1 : -1);
  if (next < 0) return loop ? tabs[last] : undefined;
  if (next > last) return loop ? tabs[0] : undefined;
  return tabs[next];
}

function TabsList({
  className,
  variant = 'default',
  activateOnFocus = true,
  loopFocus = true,
  render,
  ...props
}: ComponentPropsWithRef<'div'> &
  VariantProps<typeof tabsListVariants> & {
    /** Arrow keys select the tab they move to (the default here). */
    activateOnFocus?: boolean;
    loopFocus?: boolean;
    render?: RenderProp;
  }) {
  const tabs = useTabs();
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const all = [
      ...event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'),
    ];
    const from = all.indexOf(event.target as HTMLElement);
    if (from < 0) return;
    const next = step(all, from, event.key, tabs.orientation, loopFocus);
    if (!next) return;
    event.preventDefault();
    next.focus();
    // A disabled tab takes the focus (as Base UI's does) but not the panel.
    if (activateOnFocus && next.getAttribute('aria-disabled') !== 'true') {
      next.click();
    }
  }
  const element = useRender(
    'div',
    mergeProps(
      {
        role: 'tablist',
        'aria-orientation': tabs.orientation,
        'data-slot': 'tabs-list',
        'data-variant': variant,
        'data-orientation': tabs.orientation,
        className: cn(tabsListVariants({ variant }), className),
        onKeyDown,
      },
      props,
    ),
    render,
  );
  return (
    <ListVariantContext value={variant ?? 'default'}>
      {element}
    </ListVariantContext>
  );
}

function TabsTrigger({
  className,
  value,
  disabled,
  render,
  ...props
}: ComponentPropsWithRef<'button'> & {
  value: TabValue;
  render?: RenderProp;
}) {
  const tabs = useTabs();
  const variant = use(ListVariantContext);
  const active = Object.is(tabs.value, value);
  const register = tabs.register;
  useLayoutEffect(
    () => register(value, Boolean(disabled)),
    [register, value, disabled],
  );
  return useRender(
    'button',
    mergeProps(
      {
        type: 'button',
        role: 'tab',
        id: partId(tabs, 'tab', value),
        'aria-selected': active,
        // No aria-controls: the panel follows the tab at once (automatic
        // activation), names itself by the tab, and screen readers do
        // little with the link (Modern Web Guidance, tabs).
        tabIndex: active ? 0 : -1,
        // Focusable when disabled, so the arrow keys can pass it.
        'aria-disabled': disabled || undefined,
        'data-slot': 'tabs-trigger',
        'data-orientation': tabs.orientation,
        'data-active': active ? '' : undefined,
        'data-disabled': disabled ? '' : undefined,
        className: cn(
          "relative inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:focus-ring group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          TRIGGER[variant],
          active ? ACTIVE[variant] : IDLE[variant],
          disabled && 'pointer-events-none text-muted',
          className,
        ),
        onClick(event: React.MouseEvent) {
          if (!disabled) tabs.select(value, event.nativeEvent);
        },
      },
      props,
    ),
    render,
  );
}

function TabsContent({
  className,
  value,
  keepMounted = false,
  render,
  ...props
}: ComponentPropsWithRef<'div'> & {
  value: TabValue;
  keepMounted?: boolean;
  render?: RenderProp;
}) {
  const tabs = useTabs();
  const active = Object.is(tabs.value, value);
  const element = useRender(
    'div',
    {
      role: 'tabpanel',
      id: partId(tabs, 'panel', value),
      'aria-labelledby': partId(tabs, 'tab', value),
      tabIndex: 0,
      hidden: !active,
      'data-slot': 'tabs-content',
      'data-orientation': tabs.orientation,
      // Takes the focus (Tab after the list): the one focus ring shows it.
      className: cn(
        'flex-1 rounded-md text-sm outline-none focus-visible:focus-ring',
        className,
      ),
      ...props,
    },
    render,
  );
  return active || keepMounted ? element : null;
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
