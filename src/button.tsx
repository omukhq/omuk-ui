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
//   outline      secondary        `bg-page inset-ring inset-ring-control`, dialogs and forms
//   secondary    secondary        (the same; the root's grey fill has no role)
//   ghost        ghost            toolbars, headers, menus; pressed `bg-selected`
//   destructive  danger           `bg-page inset-ring inset-ring-control text-danger`
//   danger-confirm                `bg-danger`, the last step of a delete only
//   link                          `text-accent`
//
// Outlined buttons take the 1-wide control edge, as fields do, darker on
// hover (R7; owner, 18 Nov 2026). Sizes
// (R48, shadcn's scale): xs 24 (`h-6`), sm 28 (`h-7`, the formatting
// toolbar), default 32 (`h-8`), lg 36 (`h-9`, forms and dialogs); the icon
// sizes are the same squares. xs is only for row actions and chips inside
// dense lists and tables; on a touch screen it keeps a 32 hit area.
//
// Disabled is never a fade: buttons with a fill or an edge take
// `bg-hover inset-ring inset-ring-border text-muted`; ghost and link buttons stay text only
// (`text-muted`, no fill, no edge). A loading button keeps its look: the
// label stays in the layout, hidden, under a spinner in the button's text
// colour.

/** Disabled for a button that has a fill or an edge (not while loading). */
const DISABLED_FILLED =
  'not-data-loading:disabled:bg-hover not-data-loading:disabled:inset-ring not-data-loading:disabled:inset-ring-border not-data-loading:aria-disabled:bg-hover not-data-loading:aria-disabled:inset-ring not-data-loading:aria-disabled:inset-ring-border';

/** Disabled for a text-only button: no fill on hover either. */
const DISABLED_TEXT = 'disabled:bg-transparent aria-disabled:bg-transparent';

const buttonVariants = cva(
  `group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors select-none ${FOCUS} data-loading:pointer-events-none not-data-loading:disabled:cursor-not-allowed not-data-loading:disabled:text-muted not-data-loading:aria-disabled:text-muted aria-invalid:inset-ring-2 aria-invalid:inset-ring-danger [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
  {
    variants: {
      variant: {
        default: `bg-primary text-on-primary hover:bg-primary/90 ${DISABLED_FILLED}`,
        outline: `bg-page text-foreground inset-ring inset-ring-control hover:inset-ring-outline aria-expanded:inset-ring-outline ${DISABLED_FILLED}`,
        secondary: `bg-page text-foreground inset-ring inset-ring-control hover:inset-ring-outline aria-expanded:inset-ring-outline ${DISABLED_FILLED}`,
        ghost: `bg-transparent text-foreground hover:bg-hover aria-expanded:bg-hover aria-pressed:bg-selected ${DISABLED_TEXT}`,
        destructive: `bg-page text-danger inset-ring inset-ring-control hover:inset-ring-outline ${DISABLED_FILLED}`,
        'danger-confirm': `bg-danger text-on-primary hover:bg-danger/90 ${DISABLED_FILLED}`,
        link: `text-accent underline-offset-4 hover:underline ${DISABLED_TEXT}`,
      },
      size: {
        default:
          'h-8 px-3 [&:has(>[data-icon=inline-start])]:pl-2 [&:has(>[data-icon=inline-end])]:pr-2',
        xs: 'h-6 gap-1 rounded-sm px-2 text-xs pointer-coarse:after:absolute pointer-coarse:after:-inset-1',
        sm: 'h-7 gap-1 rounded-sm px-2',
        lg: 'h-9 px-4 [&:has(>[data-icon=inline-start])]:pl-3 [&:has(>[data-icon=inline-end])]:pr-3',
        icon: 'size-8 squircle',
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
      className: cn(buttonVariants({ variant, size, className })),
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

export type { ButtonProps };
export { Button, buttonVariants };
