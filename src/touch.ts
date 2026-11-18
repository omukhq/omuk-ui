// Controls a finger's size on phone-width screens (DESIGN.md §9, board
// 9-Phone; `h-12` / `size-12` are 48). Not used by the kit's own parts since
// 18 Nov 2026 (owner: 36 everywhere); an app may still put it on a phone
// container. On a container, not on each
// control: the phone's top bar, its format bar and the bottom sheets a
// popover becomes there size every button, field and select trigger inside
// them, and nothing changes from 640 up. Buttons say which size they are
// (`data-size`, omuk-ui's Button): an icon button becomes a 48 square, a
// labelled one 48 tall.
export const PHONE_TOUCH = [
  'max-sm:[&_[data-slot=button][data-size^=icon]]:size-12', // design-ok: selectors, not values
  'max-sm:[&_[data-slot=button]:not([data-size^=icon])]:h-12', // design-ok: selectors, not values
  'max-sm:**:data-[slot=input]:h-12', // design-ok: selectors, not values
  'max-sm:**:data-[slot=input-group]:h-12', // design-ok: selectors, not values
  'max-sm:**:data-[slot=select-trigger]:h-12', // design-ok: selectors, not values
].join(' ');
