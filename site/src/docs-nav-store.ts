// Opens the docs' component list (a drawer on a phone) from the header. The
// header is in the main bundle and the docs are a chunk of their own, so the
// docs layout hands its opener here while it is on the page.

let opener: (() => void) | null = null;

/** The docs layout's opener, while it is on the page; gives back the undo. */
export function setDocsNavOpener(open: () => void) {
  opener = open;
  return () => {
    if (opener === open) opener = null;
  };
}

/** Opens the component list, when the docs are on the page. */
export function openDocsNav() {
  opener?.();
}
