import { cva, type VariantProps } from 'class-variance-authority';
import type { KeyboardEvent } from 'react';
import { FOCUS } from './recipes';
import { type RenderProps, useRender } from './render';
import { Spinner } from './spinner';
import { cn } from './utils';

// DESIGN.md, section 3, Button. The variant names are the root's, which
// shared code passes; each draws a design-system recipe:
//
//   default      primary          `bg-primary text-on-primary`, one per surface
//   outline      secondary        `bg-page inset-ring-2 inset-ring-control`, dialogs and forms
//   secondary    secondary        (the same; the root's grey fill has no role)
//   ghost        ghost            toolbars, headers, menus; pressed `bg-selected`
//   destructive  danger           `bg-page inset-ring-2 inset-ring-control text-danger`
//   danger-confirm                `bg-danger`, the last step of a delete only
//   link                          `text-accent`
//
// Outlined buttons take the 2-wide control edge, as fields do (React
// Spectrum's recipe, owner 18 Nov 2026), darker on hover (R7). Sizes
// (R48, shadcn's scale): xs 24 (`h-6`), sm 28 (`h-7`, the formatting
// toolbar), default 36 (`h-9`; 32 until 18 Nov 2026, owner), lg 36 (`h-9`, forms and dialogs); the icon
// sizes are the same squares. xs is only for row actions and chips inside
// dense lists and tables; on a touch screen it keeps a 32 hit area.
//
// Disabled is never a fade: buttons with a fill or an edge take
// `bg-hover inset-ring-2 inset-ring-border text-muted`; ghost and link buttons stay text only
// (`text-muted`, no fill, no edge). A loading button keeps its look: the
// label stays in the layout, hidden, under a spinner in the button's text
// colour.

// Disabled and loading are added only when the button is so (it knows):
// a button at rest carries none of their classes. The hover ones override
// the variant's hover, which cn drops.

/** Disabled, for a button that has a fill or an edge (not while loading). */
const OFF_FILLED =
  'cursor-not-allowed bg-hover text-muted inset-ring-2 inset-ring-border hover:bg-hover hover:inset-ring-border';

/** Disabled, for a text-only button: no fill on hover either. */
const OFF_TEXT =
  'cursor-not-allowed bg-transparent text-muted hover:bg-transparent';

const TEXT_ONLY = new Set(['ghost', 'link']);

const buttonVariants = cva(
  `group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors select-none ${FOCUS} aria-invalid:inset-ring-2 aria-invalid:inset-ring-danger [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
  {
    variants: {
      variant: {
        default: `bg-primary text-on-primary hover:bg-primary/90`,
        outline: `bg-page text-foreground inset-ring-2 inset-ring-control hover:inset-ring-outline aria-expanded:inset-ring-outline`,
        secondary: `bg-page text-foreground inset-ring-2 inset-ring-control hover:inset-ring-outline aria-expanded:inset-ring-outline`,
        ghost: `bg-transparent text-foreground hover:bg-hover aria-expanded:bg-hover aria-pressed:bg-selected`,
        destructive: `bg-page text-danger inset-ring-2 inset-ring-control hover:inset-ring-danger`,
        'danger-confirm': `bg-danger text-on-primary hover:bg-danger/90`,
        link: `text-accent underline-offset-4 hover:underline`,
      },
      size: {
        default:
          'h-9 px-3 [&:has(>[data-icon=inline-start])]:pl-2 [&:has(>[data-icon=inline-end])]:pr-2',
        xs: 'h-6 gap-1 rounded-sm px-2 text-xs pointer-coarse:after:absolute pointer-coarse:after:-inset-1',
        sm: 'h-7 gap-1 rounded-sm px-2',
        lg: 'h-9 px-4 [&:has(>[data-icon=inline-start])]:pl-3 [&:has(>[data-icon=inline-end])]:pr-3',
        icon: 'size-9 squircle',
        'icon-xs':
          'size-6 squircle pointer-coarse:after:absolute pointer-coarse:after:-inset-1',
        'icon-sm': 'size-7 squircle',
        'icon-lg': 'size-9 squircle',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = RenderProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /**
     * When true, shows a spinner over the label and disables the button. The
     * label stays in the layout, hidden, so the button keeps its size (a
     * loading state must not change the size). Sets `data-loading`.
     */
    isLoading?: boolean;
    /** What a screen reader hears while loading, e.g. "Saving". */
    loadingLabel?: string;
    /** False when `render` draws something other than a <button>. */
    nativeButton?: boolean;
    /** Keeps a disabled button in the tab order (`aria-disabled`). */
    focusableWhenDisabled?: boolean;
  };

/** Enter and Space press a non-native button, as they press a <button>. */
function pressOnKey(event: KeyboardEvent<HTMLElement>) {
  if (event.target !== event.currentTarget) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  loadingLabel = 'Loading',
  disabled,
  children,
  render,
  nativeButton = true,
  focusableWhenDisabled = false,
  type,
  onClick,
  onKeyDown,
  ...props
}: ButtonProps) {
  const off = isLoading || disabled;
  // A disabled button that stays focusable can't take the attribute.
  const native = nativeButton && !(off && focusableWhenDisabled);
  return useRender(
    'button',
    {
      'data-slot': 'button',
      // Which size, for a container that resizes its buttons on phones
      // (@/lib/touch, PHONE_TOUCH): an icon button to a 48 square.
      'data-size': size ?? 'default',
      'data-loading': isLoading || undefined,
      'data-disabled': off || undefined,
      type: nativeButton ? (type ?? 'button') : undefined,
      disabled: native ? off : undefined,
      'aria-disabled': off && !native ? true : undefined,
      role: nativeButton ? undefined : 'button',
      tabIndex: nativeButton
        ? undefined
        : off && !focusableWhenDisabled
          ? -1
          : 0,
      onClick: off ? undefined : onClick,
      onKeyDown: nativeButton
        ? onKeyDown
        : (event: KeyboardEvent<HTMLElement>) => {
            onKeyDown?.(event as KeyboardEvent<HTMLButtonElement>);
            if (!off) pressOnKey(event);
          },
      className: cn(
        buttonVariants({ variant, size }),
        isLoading && 'pointer-events-none',
        !isLoading &&
          (disabled || isTrue(props['aria-disabled'])) &&
          (TEXT_ONLY.has(variant ?? 'default') ? OFF_TEXT : OFF_FILLED),
        className,
      ),
      ...props,
      // The label stays in the layout, hidden, so the button keeps its size;
      // the spinner sits over it, centred.
      children: isLoading ? (
        <>
          <span className="invisible contents">{children}</span>
          <Spinner
            aria-label={loadingLabel}
            className="absolute inset-0 m-auto text-current"
          />
        </>
      ) : (
        children
      ),
    },
    render,
  );
}

/** aria-disabled from a caller: true or "true". */
function isTrue(value: unknown): boolean {
  return value === true || value === 'true';
}

export type { ButtonProps };
export { Button, buttonVariants };
