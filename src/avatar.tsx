import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from './utils';

// DESIGN.md, section 3, Avatar. 24 by default (`size-6`); 16 (`sm`) for a
// mark in a row (the AI author's app); 48 (`lg`) for the invite page.
// People are round, apps square on the page with the `inset-ring inset-ring-border`, teams square.
//
// Colours (decisions, R3 owner decision; palette since v3.12):
// - A person without a photo: one of four palette shades, picked by a stable
//   hash of `userId`; without a `userId`, the primary ground. The shades are
//   the kit's four team colours snapped to the nearest palette shade that
//   keeps white text at 4.5:1 or more (teal-700, violet-600, orange-700,
//   blue-700); the same in light and dark. An avatar component, so the
//   palette is allowed here (DESIGN.md rule 10) and nowhere else in chrome.
// - A team: its colour is data (the team's owner picks it; it is saved in
//   the team's settings), passed as `color` and applied inline.
// The letter is white (`text-white`) on both.

const avatarVariants = cva(
  'inline-flex shrink-0 items-center justify-center overflow-hidden font-medium select-none',
  {
    variants: {
      kind: {
        person: 'rounded-full bg-primary text-on-primary',
        app: 'squircle bg-page text-foreground inset-ring inset-ring-border',
        team: 'squircle bg-primary text-on-primary',
      },
      size: {
        // 16 · 24 · 32 · 40 · 48 (owner, 18 Nov 2026; lg was 48).
        sm: 'size-4 text-2xs',
        md: 'size-6 text-xs',
        lg: 'size-8 text-xs',
        xl: 'size-10 text-sm',
        '2xl': 'size-12 text-lg',
      },
    },
    defaultVariants: { kind: 'person', size: 'md' },
  },
);

/** The people avatar colours, by index: palette shades (theme.css). */
const AVATAR_COLORS = [
  'bg-teal-700 text-white',
  'bg-violet-600 text-white',
  'bg-orange-700 text-white',
  'bg-blue-700 text-white',
] as const;

/**
 * The avatar colour for a person without a photo: the same user ID always
 * gives the same colour (FNV-1a over the ID, modulo the palette).
 */
function avatarColorClass(userId: string): (typeof AVATAR_COLORS)[number] {
  let hash = 0x811c9dc5;
  for (let at = 0; at < userId.length; at++) {
    hash ^= userId.charCodeAt(at);
    hash = Math.imul(hash, 0x01000193);
  }
  return AVATAR_COLORS[(hash >>> 0) % AVATAR_COLORS.length];
}

type AvatarProps = ComponentProps<'span'> &
  VariantProps<typeof avatarVariants> & {
    /** A picture; the children (initials, a logo) show without one. */
    src?: string | null;
    /** A person's user ID: picks their colour when there is no picture. */
    userId?: string | null;
    /** A team's colour, as saved in the team's settings (data, not a token). */
    color?: string | null;
  };

function Avatar({
  className,
  kind = 'person',
  size,
  src,
  userId,
  color,
  style,
  children,
  ...props
}: AvatarProps) {
  const palette =
    !src && !color && kind === 'person' && userId
      ? avatarColorClass(userId)
      : null;
  return (
    <span
      data-slot="avatar"
      data-kind={kind}
      className={cn(
        avatarVariants({ kind, size }),
        palette,
        color && 'text-white',
        className,
      )}
      // R3: a team's colour is data from the team's settings, the one inline
      // colour in omuk-ui. design-ok
      style={color ? { ...style, backgroundColor: color } : style}
      {...props}
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : size === 'sm' && typeof children === 'string' ? (
        // 16 holds one letter: the first of the initials (owner, 18 Nov 2026).
        firstLetter(children)
      ) : (
        children
      )}
    </span>
  );
}

/** The first letter (a whole character, accents and all). */
function firstLetter(text: string): string {
  return Array.from(text.trim())[0] ?? '';
}

/**
 * The end of a stack: how many more people there are (`+3`), round, on the
 * hover fill in the muted colour.
 */
function AvatarCount({
  className,
  size = 'md',
  count,
  ...props
}: Omit<ComponentProps<'span'>, 'children'> &
  Pick<VariantProps<typeof avatarVariants>, 'size'> & { count: number }) {
  return (
    <span
      data-slot="avatar"
      data-kind="count"
      className={cn(
        avatarVariants({ kind: 'person', size }),
        'bg-page text-muted',
        className,
      )}
      {...props}
    >
      {/* The hover fill is a tint: on the page ground, so the avatar it
          overlaps does not show through. */}
      <span className="grid size-full place-items-center bg-hover">
        +{count}
      </span>
    </span>
  );
}

/**
 * Avatars side by side, each over the last by `1` (4), with a 2-wide ring in
 * the ground colour between them. Every person is a filled avatar; an
 * `AvatarCount` may end the stack.
 */
function AvatarStack({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar-stack"
      className={cn(
        'inline-flex items-center *:data-[slot=avatar]:outline-2 *:data-[slot=avatar]:outline-page [&>[data-slot=avatar]+[data-slot=avatar]]:-ml-1',
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarCount, AvatarStack, avatarColorClass };
