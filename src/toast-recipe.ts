// DESIGN.md's toast, as class lists: the kit's <Toaster> (./sonner.tsx)
// draws with it, and beta's /ui board shows it. No imports.

/**
 * Toast (DESIGN.md, section 3; decisions, R19): `flex items-start gap-3 p-2
 * pl-4 rounded-lg bg-primary text-on-primary shadow-lg`. The text is
 * `py-1.5`, so one line centres on the 32 action and a second line
 * starts level with it; two lines, then cut. The icon sits in a 32-tall box,
 * so it centres on the first line. The action (an outlined sm button, 2-wide
 * muted edge) and the close button are `self-center`, 8 from the edges. With
 * neither, the end padding is 16 (`plain`).
 */
export const TOAST = {
  toast:
    'flex w-fit max-w-full items-start gap-3 rounded-lg bg-primary p-2 pl-4 text-sm text-on-primary shadow-lg',
  plain: 'pr-4',
  content: 'flex min-w-0 flex-1 flex-col py-1.5',
  title: 'line-clamp-2',
  description: 'line-clamp-2 text-xs text-outline',
  icon: 'flex h-8 shrink-0 items-center [&>svg]:size-4',
  actionButton:
    'h-8 shrink-0 cursor-pointer self-center rounded-md px-3 text-sm font-medium text-on-primary inset-ring-2 inset-ring-muted outline-none hover:bg-on-primary/10 focus-visible:focus-ring',
  closeButton:
    'order-last grid size-8 shrink-0 cursor-pointer place-items-center self-center rounded-md text-outline outline-none hover:text-on-primary focus-visible:focus-ring [&>svg]:size-4',
};
