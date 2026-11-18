// DESIGN.md's toast, as class lists: the kit's <Toaster> (./sonner.tsx)
// draws with it, and beta's /ui board shows it. No imports.

/**
 * Toast (DESIGN.md, section 3; decisions, R19; owner, 18 Nov 2026: the
 * coloured toasts board, dash-kit design/toasts.html). Every toast in the
 * stack is the stack's width. A plain or loading toast is the raised
 * surface; success, info, warning and error each take a soft fill of their
 * colour, no edge, with the icon in the strong colour. `py-1.5` around a
 * 32-tall row: the text is `py-1.5`, so one line centres on the icon and the
 * action, and a second line starts level with them; two lines, then cut.
 * The action is a small outlined button in the toast's own text colour;
 * the close button, the same colour, softer.
 */
export const TOAST = {
  toast:
    'flex w-full items-start gap-3 rounded-lg px-2 py-1.5 pl-4 text-sm shadow-lg',
  plain: 'pr-4',
  content: 'flex min-w-0 flex-1 flex-col py-1.5',
  title: 'line-clamp-2',
  description: 'line-clamp-2 text-xs opacity-75',
  icon: 'flex h-8 shrink-0 items-center [&>svg]:size-4',
  actionButton:
    'h-7 shrink-0 cursor-pointer self-center rounded-md px-2.5 text-xs outline-none inset-ring-2 inset-ring-current/25 hover:bg-current/10 focus-visible:focus-ring',
  closeButton:
    'order-last grid size-8 shrink-0 cursor-pointer place-items-center self-center rounded-md opacity-70 outline-none hover:opacity-100 focus-visible:focus-ring [&>svg]:size-4',
  /** Each kind's fill and text, and its icon's colour. */
  kind: {
    default: 'bg-raised text-foreground',
    loading: 'bg-raised text-foreground',
    success: 'bg-success-soft text-on-success-soft',
    info: 'bg-info-soft text-on-info-soft',
    warning: 'bg-warning-soft text-on-warning-soft',
    error: 'bg-danger-soft text-on-danger-soft',
  },
  kindIcon: {
    default: '',
    loading: 'text-muted',
    success: 'text-success',
    info: 'text-info',
    warning: 'text-warning',
    error: 'text-danger',
  },
};
