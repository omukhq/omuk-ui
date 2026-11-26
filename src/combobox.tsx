import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import {
  type ComponentPropsWithRef,
  createContext,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  use,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from './button';
import { FormValue } from './form-value';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './input-group';
import {
  type OpenChangeDetails,
  PopupFrame,
  type PopupRoot,
  type PopupRootProps,
  popupState,
  triggerState,
  usePopupRoot,
} from './popup';
import type { Align, Side } from './position';
import {
  CHIP,
  FIELD,
  FIELD_OFF,
  FIELD_SIZE,
  FIELD_WRAPPER_EDGE,
  type FieldSize,
  MENU_SEPARATOR,
  OPTION_ROW,
  POP,
  SECTION_LABEL,
  SURFACE,
  TICK_SLOT,
} from './recipes';
import { mergeProps, type RenderProp, useMergedRef, useRender } from './render';
import { cn, isComposing } from './utils';

// A combobox: a text field that filters a list of options under it
// (WAI-ARIA combobox with a listbox popup). The focus stays in the field;
// the highlighted option is `aria-activedescendant`. The arrow keys move
// the highlight and open the list, Enter chooses, Escape closes, typing
// filters. With `multiple`, the chosen options are chips beside the field.
// With ComboboxButton, the field is a button that shows the value, and the
// search field sits in the list (Base UI's "input inside popup").

export type ChangeDetails = Omit<OpenChangeDetails, 'trigger'>;

function details(reason: string, event: Event | undefined): ChangeDetails {
  let canceled = false;
  return {
    reason,
    event,
    cancel() {
      canceled = true;
    },
    get isCanceled() {
      return canceled;
    },
  };
}

type Group<Item> = { items: readonly Item[] };

function isGroup(item: unknown): item is Group<unknown> {
  return (
    typeof item === 'object' &&
    item !== null &&
    Array.isArray((item as { items?: unknown }).items)
  );
}

/** Base UI's default label: the `label`, else the `value`, else the item. */
function defaultLabel(item: unknown) {
  if (item && typeof item === 'object') {
    if ('label' in item && item.label != null) return String(item.label);
    if ('value' in item) return String(item.value);
  }
  return item == null ? '' : String(item);
}

/** Lower case and without accents: "Zürich" is found by "zur". */
function fold(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase();
}

type ValueOf<Value, Multiple> = Multiple extends true ? Value[] : Value | null;

type ComboboxState = PopupRoot & {
  id: string;
  multiple: boolean;
  disabled: boolean;
  readOnly: boolean;
  openOnInputClick: boolean;
  autoHighlight: boolean;
  value: unknown;
  selected: unknown[];
  isSelected: (item: unknown) => boolean;
  choose: (item: unknown, event: Event) => void;
  remove: (index: number, event: Event) => void;
  clear: (event: Event) => void;
  labelOf: (item: unknown) => string;
  inputValue: string;
  type: (text: string, event: Event) => void;
  /** The items left after filtering: flat, or groups with their items. */
  shown: readonly unknown[];
  empty: boolean;
  highlighted: string | null;
  setHighlighted: (id: string | null) => void;
  /** What to highlight when the list opens. */
  pending: RefObject<'first' | 'last' | 'selected' | 'chosen' | null>;
  input: RefObject<HTMLInputElement | null>;
  list: RefObject<HTMLDivElement | null>;
  /** A ComboboxButton is the field: the search sits in the list. */
  searchInPopup: RefObject<boolean>;
  /** The status region, on the page from the start: what is put in it is read out. */
  region: HTMLDivElement | null;
};

const ComboboxContext = createContext<ComboboxState | null>(null);

/** True inside ComboboxContent: a ComboboxInput there is the list's search. */
const InPopupContext = createContext(false);

function useCombobox() {
  const combobox = use(ComboboxContext);
  if (!combobox) throw new Error('A combobox part must be inside <Combobox>.');
  return combobox;
}

type ComboboxProps<
  Value,
  Multiple extends boolean | undefined,
> = PopupRootProps & {
  items?: readonly Value[] | readonly Group<Value>[];
  multiple?: Multiple;
  value?: ValueOf<Value, Multiple>;
  defaultValue?: ValueOf<Value, Multiple>;
  onValueChange?: (
    value: ValueOf<Value, Multiple>,
    eventDetails: ChangeDetails,
  ) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (
    inputValue: string,
    eventDetails: ChangeDetails,
  ) => void;
  isItemEqualToValue?: (item: Value, value: Value) => boolean;
  itemToStringLabel?: (item: Value) => string;
  itemToStringValue?: (item: Value) => string;
  /** Which items match the typed text; null shows every item. */
  filter?:
    | ((
        item: Value,
        query: string,
        itemToString?: (item: Value) => string,
      ) => boolean)
    | null;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoHighlight?: boolean;
  openOnInputClick?: boolean;
  children?: ReactNode;
};

function Combobox<Value, Multiple extends boolean | undefined = false>({
  items,
  multiple,
  value: controlled,
  defaultValue,
  onValueChange,
  inputValue: controlledInput,
  defaultInputValue,
  onInputValueChange,
  isItemEqualToValue,
  itemToStringLabel,
  itemToStringValue,
  filter,
  name,
  required,
  disabled = false,
  readOnly = false,
  autoHighlight = false,
  openOnInputClick = true,
  onOpenChange,
  children,
  ...props
}: ComboboxProps<Value, Multiple>) {
  const many = Boolean(multiple);
  const id = useId();
  const [own, setOwn] = useState<unknown>(defaultValue ?? (many ? [] : null));
  const value: unknown = controlled === undefined ? own : controlled;
  const selected = many
    ? ((value as unknown[] | null) ?? [])
    : value == null
      ? []
      : [value];

  function equal(a: unknown, b: unknown) {
    if (a == null || b == null) return a === b;
    return isItemEqualToValue
      ? isItemEqualToValue(a as Value, b as Value)
      : Object.is(a, b);
  }
  function labelOf(item: unknown) {
    return itemToStringLabel && item != null
      ? itemToStringLabel(item as Value)
      : defaultLabel(item);
  }
  const chosenLabel = !many && value != null ? labelOf(value) : '';

  const [ownInput, setOwnInput] = useState(defaultInputValue ?? chosenLabel);
  const inputValue = controlledInput ?? ownInput;
  // The value changed from outside (a form reset, a parent's state): the
  // field shows its label.
  const [seen, setSeen] = useState(value);
  const same = many
    ? (seen as unknown[] | null)?.length === selected.length &&
      selected.every((item, at) => equal(item, (seen as unknown[])[at]))
    : equal(seen, value);
  if (!same) {
    setSeen(value);
    if (!many) setOwnInput(chosenLabel);
  }

  const [highlighted, setHighlighted] = useState<string | null>(null);
  const pending = useRef<'first' | 'last' | 'selected' | 'chosen' | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const list = useRef<HTMLDivElement | null>(null);
  const searchInPopup = useRef(false);

  // Where ComboboxStatus and ComboboxEmpty are read out. They mount with
  // the list, and a live region that appears already filled is often not
  // read out; this one is on the page from the start, so text they put in
  // it (a portal) is.
  const [region, setRegion] = useState<HTMLDivElement | null>(null);

  function type(
    text: string,
    event: Event | undefined,
    reason = 'input-change',
  ) {
    onInputValueChange?.(text, details(reason, event));
    setOwnInput(text);
  }

  const root = usePopupRoot({
    ...props,
    onOpenChange(next, change) {
      onOpenChange?.(next, change);
      if (next || change.isCanceled) return;
      // Closed without choosing: the field shows the value again.
      // A search in the list starts empty each time.
      if (change.reason !== 'item-press') {
        type(
          many || searchInPopup.current ? '' : chosenLabel,
          change.event,
          change.reason,
        );
      }
    },
  });
  if (root.status === 'closed' && highlighted !== null) setHighlighted(null);

  function commit(next: unknown, event: Event) {
    const change = details('item-press', event);
    onValueChange?.(next as ValueOf<Value, Multiple>, change);
    if (!change.isCanceled) setOwn(next);
    return !change.isCanceled;
  }

  function choose(item: unknown, event: Event) {
    if (many) {
      const next = selected.some((each) => equal(each, item))
        ? selected.filter((each) => !equal(each, item))
        : [...selected, item];
      commit(next, event);
      if (inputValue) type('', event, 'item-press');
      return;
    }
    if (!equal(item, value) && !commit(item, event)) return;
    type(searchInPopup.current ? '' : labelOf(item), event, 'item-press');
    root.setOpen(false, 'item-press', event);
  }

  // A field that holds the chosen label lists everything, not just it.
  const query =
    !many && value != null && inputValue === chosenLabel ? '' : inputValue;
  function matches(item: unknown) {
    if (filter === null || !query) return true;
    if (filter) return filter(item as Value, query, itemToStringLabel);
    return fold(labelOf(item)).includes(fold(query.trim()));
  }
  const all = (items ?? []) as readonly unknown[];
  const shown = isGroup(all[0])
    ? (all as Group<unknown>[])
        .map((group) => ({ ...group, items: group.items.filter(matches) }))
        .filter((group) => group.items.length > 0)
    : all.filter(matches);

  return (
    <ComboboxContext
      value={{
        ...root,
        id,
        multiple: many,
        disabled,
        readOnly,
        openOnInputClick,
        autoHighlight,
        value,
        selected,
        isSelected: (item) => selected.some((each) => equal(each, item)),
        choose,
        remove(index, event) {
          commit(
            selected.filter((_, at) => at !== index),
            event,
          );
        },
        clear(event) {
          commit(many ? [] : null, event);
          type('', event, 'clear-press');
          input.current?.focus();
        },
        labelOf,
        inputValue,
        type,
        shown,
        empty: items !== undefined && shown.length === 0,
        highlighted,
        setHighlighted,
        pending,
        input,
        list,
        searchInPopup,
        region,
      }}
    >
      {children}
      <div ref={setRegion} role="status" className="sr-only" />
      {name &&
        (selected.length ? selected : [null]).map((item, at) => (
          <FormValue
            key={at}
            name={name}
            required={required}
            disabled={disabled}
            focusTarget={() => input.current}
            value={
              item == null
                ? ''
                : itemToStringValue
                  ? itemToStringValue(item as Value)
                  : item && typeof item === 'object' && 'value' in item
                    ? String(item.value)
                    : String(item)
            }
          />
        ))}
    </ComboboxContext>
  );
}

// --- The field ---------------------------------------------------------------

const OPTIONS = '[role=option]:not([data-disabled])';

function optionsOf(list: Element | null) {
  return list ? [...list.querySelectorAll<HTMLElement>(OPTIONS)] : [];
}

function show(combobox: ComboboxState, option: HTMLElement | undefined) {
  if (!option) return;
  combobox.setHighlighted(option.id);
  option.scrollIntoView({ block: 'nearest' });
}

/** The props of the field's <input>: the combobox role and its keys. */
function useInputProps(
  combobox: ComboboxState,
  { ref, disabled: ownDisabled, ...props }: ComponentPropsWithRef<'input'>,
) {
  const disabled = combobox.disabled || ownDisabled;
  const register = useMergedRef(ref, (node: HTMLInputElement | null) => {
    combobox.input.current = node;
    // In chips, the chips box is what the list sits under; in the list, the
    // ComboboxButton is.
    if (
      node &&
      !node.closest('[data-slot=combobox-chips]') &&
      !node.closest('[data-slot=combobox-content]')
    ) {
      // The whole field, not the text box in it: the list lines up with
      // the field's edge and width, also with a label before the text.
      combobox.setTrigger(
        node.closest<HTMLElement>('[data-slot=input-group]') ?? node,
      );
    }
  });

  function open(
    event: React.SyntheticEvent,
    at: ComboboxState['pending']['current'],
  ) {
    if (combobox.readOnly) return;
    combobox.pending.current = at;
    combobox.setOpen(true, 'list-navigation', event);
  }

  function move(step: 1 | -1) {
    const options = optionsOf(combobox.list.current);
    if (!options.length) return;
    const at = options.findIndex(
      (option) => option.id === combobox.highlighted,
    );
    const next =
      at < 0
        ? step === 1
          ? 0
          : options.length - 1
        : (at + step + options.length) % options.length;
    show(combobox, options[next]);
  }

  return mergeProps(
    {
      ref: register,
      type: 'text',
      role: 'combobox',
      autoComplete: 'off',
      'aria-autocomplete': 'list',
      'aria-expanded': combobox.open,
      'aria-controls': combobox.open ? `${combobox.id}-list` : undefined,
      'aria-activedescendant':
        (combobox.open && combobox.highlighted) || undefined,
      value: combobox.inputValue,
      disabled,
      readOnly: combobox.readOnly || undefined,
      ...triggerState(combobox.open),
      onChange(event: React.ChangeEvent<HTMLInputElement>) {
        combobox.type(event.currentTarget.value, event.nativeEvent);
        combobox.setHighlighted(null);
        if (!combobox.open) open(event, null);
      },
      onClick(event: React.MouseEvent) {
        if (combobox.openOnInputClick && !combobox.open) open(event, 'chosen');
      },
      onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (isComposing(event.nativeEvent)) return;
        const { open: isOpen, highlighted } = combobox;
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowUp':
            event.preventDefault();
            if (!isOpen) {
              open(
                event,
                event.key === 'ArrowUp'
                  ? 'last'
                  : combobox.selected.length
                    ? 'selected'
                    : 'first',
              );
            } else move(event.key === 'ArrowDown' ? 1 : -1);
            return;
          case 'Enter': {
            if (!isOpen) return;
            const option = highlighted
              ? document.getElementById(highlighted)
              : combobox.autoHighlight
                ? optionsOf(combobox.list.current)[0]
                : null;
            if (!option) return;
            event.preventDefault();
            option.click();
            return;
          }
          case 'Tab':
            if (isOpen) combobox.setOpen(false, 'focus-out', event);
            return;
          case 'Backspace':
            if (
              combobox.multiple &&
              combobox.inputValue === '' &&
              combobox.selected.length
            ) {
              combobox.remove(combobox.selected.length - 1, event.nativeEvent);
            }
        }
      },
    },
    props,
  );
}

function ComboboxValue({
  children,
  placeholder,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: Base UI's signature; callers type the value.
  children?: ReactNode | ((value: any) => ReactNode);
  /** Shown while nothing is chosen (without `children`). */
  placeholder?: ReactNode;
}) {
  const combobox = useCombobox();
  if (typeof children === 'function') return children(combobox.value);
  if (children != null) return children;
  if (!combobox.selected.length && placeholder != null) return placeholder;
  return combobox.selected.map(combobox.labelOf).join(', ');
}

/** Keeps the focus in the field while a button beside it is pressed. */
function keepFocus(event: React.MouseEvent) {
  event.preventDefault();
}

function ComboboxTrigger({
  className,
  children,
  render,
  nativeButton: _nativeButton,
  ...props
}: ComponentPropsWithRef<'button'> & {
  render?: RenderProp;
  nativeButton?: boolean;
}) {
  const combobox = useCombobox();
  return useRender(
    'button',
    mergeProps(
      {
        type: 'button',
        tabIndex: -1,
        'aria-label': 'Show options',
        'aria-haspopup': 'listbox',
        'aria-expanded': combobox.open,
        'aria-controls': combobox.open ? `${combobox.id}-list` : undefined,
        // As Base UI's trigger: both while the list is open. The input's
        // chevron clears its open background with `data-pressed:`.
        ...triggerState(combobox.open),
        'data-pressed': combobox.open ? '' : undefined,
        'data-slot': 'combobox-trigger',
        disabled: combobox.disabled || undefined,
        className: cn("[&_svg:not([class*='size-'])]:size-4", className),
        onMouseDown: keepFocus,
        onClick(event: React.MouseEvent) {
          combobox.pending.current = combobox.open ? null : 'chosen';
          combobox.setOpen(!combobox.open, 'trigger-press', event);
          combobox.input.current?.focus();
        },
        children: (
          <>
            {children}
            {combobox.open ? (
              <ChevronUpIcon
                strokeWidth={1.5}
                className="pointer-events-none size-4 text-muted"
              />
            ) : (
              <ChevronDownIcon
                strokeWidth={1.5}
                className="pointer-events-none size-4 text-muted"
              />
            )}
          </>
        ),
      },
      props,
    ),
    render,
  );
}

/** Shown while there is something to clear: a value or typed text. */
function ComboboxClear({
  className,
  ...props
}: React.ComponentProps<typeof InputGroupButton>) {
  const combobox = useCombobox();
  if (!combobox.selected.length && !combobox.inputValue) return null;
  return (
    <InputGroupButton
      variant="ghost"
      size="icon-xs"
      data-slot="combobox-clear"
      aria-label="Clear"
      className={cn(className)}
      onMouseDown={keepFocus}
      onClick={(event) => combobox.clear(event.nativeEvent)}
      {...props}
    >
      <XIcon strokeWidth={1.5} className="pointer-events-none" />
    </InputGroupButton>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger,
  showClear = false,
  size,
  ...props
}: Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  /** The height, as Button's: xs 24, sm 28, md 32 (default), lg 36. */
  size?: FieldSize;
  /** The chevron. Default: shown, except in the list (a search field). */
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  const combobox = useCombobox();
  const inPopup = use(InPopupContext);
  const off = combobox.disabled || disabled;
  return (
    <InputGroup
      size={size}
      disabled={off}
      className={cn(
        'w-auto',
        // The search at the top of the list: the list is the focus, so the
        // field keeps the outline edge and takes no ring.
        inPopup &&
          'has-[input:focus-visible]:edge-control has-[input:focus-visible]:inset-ring-outline has-[input:focus-visible]:ring-0',
        className,
      )}
    >
      {inPopup && (
        <InputGroupAddon align="inline-start">
          <SearchIcon strokeWidth={1.5} aria-hidden className="text-muted" />
        </InputGroupAddon>
      )}
      <InputGroupInput {...useInputProps(combobox, { disabled, ...props })} />
      <InputGroupAddon align="inline-end">
        {(showTrigger ?? !inPopup) && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            className="data-pressed:bg-transparent [[data-slot=input-group]:has([data-slot=combobox-clear])_&]:hidden"
            disabled={off}
          />
        )}
        {showClear && (
          <ComboboxClear
            disabled={off}
            // "Clear Role": several fields side by side need their names.
            {...(props['aria-label'] && {
              'aria-label': `Clear ${props['aria-label']}`,
            })}
          />
        )}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

// --- The popup --------------------------------------------------------------

function ComboboxContent({
  className,
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  alignOffset = 0,
  anchor,
  ...props
}: ComponentPropsWithRef<'div'> & {
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  /** Base UI's anchor: the chips box, which the list already sits under. */
  anchor?: unknown;
}) {
  const combobox = useCombobox();

  function highlightIn(positioner: HTMLElement) {
    const options = optionsOf(positioner);
    const chosen = options.find((option) =>
      option.hasAttribute('data-selected'),
    );
    const how = combobox.pending.current;
    combobox.pending.current = null;
    const target =
      how === 'first'
        ? options[0]
        : how === 'last'
          ? options.at(-1)
          : how === 'selected'
            ? (chosen ?? options[0])
            : // A press opens on the chosen option, as Base UI does.
              how === 'chosen'
              ? chosen
              : undefined;
    chosen?.scrollIntoView({ block: 'nearest' });
    // The search in the list takes the focus; the field keeps it otherwise.
    if (combobox.searchInPopup.current) {
      positioner
        .querySelector<HTMLInputElement>('input[role=combobox]')
        ?.focus({ preventScroll: true });
    }
    show(combobox, target);
  }

  /** A press on the field's own parts (the chevron, the clear) is not outside. */
  function dismiss(reason: string, event: Event) {
    const field =
      combobox.trigger?.closest('[data-slot=input-group]') ?? combobox.trigger;
    if (reason === 'outside-press' && field?.contains(event.target as Node)) {
      return;
    }
    combobox.setOpen(false, reason, event);
  }

  return (
    <PopupFrame
      root={combobox}
      kind="popover"
      placement={{ side, align, sideOffset, alignOffset }}
      className="isolate z-50"
      initialFocus={highlightIn}
      // Back to the ComboboxButton; a field never lost the focus.
      finalFocus={() => combobox.searchInPopup.current}
      onDismiss={dismiss}
    >
      <div
        data-slot="combobox-content"
        data-chips={!!anchor}
        data-side={side}
        data-align={align}
        data-empty={combobox.empty ? '' : undefined}
        {...popupState(combobox.open)}
        // A menu's surface (DESIGN.md, section 3). The list pads itself, so
        // the surface has none; a search field inside it is a small field.
        className={cn(
          SURFACE,
          POP,
          'group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-(--anchor-width) overflow-hidden p-0 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8',
          className,
        )}
        {...props}
      >
        <InPopupContext value={true}>{props.children}</InPopupContext>
      </div>
    </PopupFrame>
  );
}

/**
 * The field as a button that shows the value; the search sits in the list
 * (a ComboboxInput inside ComboboxContent). Base UI's "input inside popup":
 * a select whose options can be searched. Looks like a Select's trigger;
 * `render` gives it another look (a filter's outlined button).
 *
 *   <Combobox items={roles}>
 *     <ComboboxButton><ComboboxValue placeholder="Role" /></ComboboxButton>
 *     <ComboboxContent>
 *       <ComboboxInput placeholder="Search" />
 *       <ComboboxEmpty>No match.</ComboboxEmpty>
 *       <ComboboxList>{(role) => <ComboboxItem …>}</ComboboxList>
 *     </ComboboxContent>
 *   </Combobox>
 */
function ComboboxButton({
  className,
  children,
  render,
  ref,
  disabled: ownDisabled,
  size = 'md',
  ...props
}: ComponentPropsWithRef<'button'> & {
  render?: RenderProp;
  /** The height, as Button's: xs 24, sm 28, md 32 (default), lg 36. */
  size?: FieldSize;
}) {
  const combobox = useCombobox();
  const merged = useMergedRef(ref, (node: HTMLButtonElement | null) => {
    combobox.searchInPopup.current = node !== null;
    if (node) combobox.setTrigger(node);
  });
  const disabled = combobox.disabled || ownDisabled;

  function open(
    event: React.SyntheticEvent,
    at: ComboboxState['pending']['current'],
  ) {
    if (combobox.readOnly) return;
    if (combobox.inputValue) combobox.type('', event.nativeEvent);
    combobox.pending.current = at;
    combobox.setOpen(true, 'trigger-press', event);
  }

  return useRender(
    'button',
    mergeProps(
      {
        ref: merged,
        type: 'button',
        'aria-haspopup': 'listbox',
        'aria-expanded': combobox.open,
        'aria-controls': combobox.open ? `${combobox.id}-list` : undefined,
        'data-slot': 'combobox-button',
        'data-placeholder': combobox.selected.length ? undefined : '',
        disabled,
        ...triggerState(combobox.open),
        // A Select's look; with `render`, the rendered element's own.
        className: render
          ? className
          : cn(
              FIELD,
              disabled && FIELD_OFF,
              "flex w-fit items-center justify-between gap-2 px-3 text-sm whitespace-nowrap aria-expanded:focus-ring data-placeholder:text-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              FIELD_SIZE[size],
              size === 'xs' && 'px-2',
              className,
            ),
        onClick(event: React.MouseEvent) {
          if (combobox.open) combobox.setOpen(false, 'trigger-press', event);
          else open(event, 'chosen');
        },
        onKeyDown(event: KeyboardEvent) {
          if (combobox.open) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            open(event, event.key === 'ArrowUp' ? 'last' : 'selected');
          }
        },
        children: (
          <>
            {children ?? <ComboboxValue />}
            {combobox.open ? (
              <ChevronUpIcon
                aria-hidden
                strokeWidth={1.5}
                className="pointer-events-none size-4 text-muted"
              />
            ) : (
              <ChevronDownIcon
                aria-hidden
                strokeWidth={1.5}
                className="pointer-events-none size-4 text-muted"
              />
            )}
          </>
        ),
      },
      props,
    ),
    render,
  );
}

/**
 * A message that screen readers read out when it changes: "Loading…",
 * "12 results". Put it in ComboboxContent; it takes no room while empty.
 * Base UI's Status. Use `className="sr-only"` to only announce it.
 */
function ComboboxStatus({
  className,
  render,
  children,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  const { region } = useCombobox();
  const shown = useRender(
    'div',
    {
      'data-slot': 'combobox-status',
      className: cn(
        'flex items-center gap-2 px-3 py-2 text-sm text-muted empty:hidden [&_svg]:size-4',
        className,
      ),
      ...props,
      // Shown here, read out from the combobox's status region.
      'aria-hidden': true,
      children,
    },
    render,
  );
  return (
    <>
      {shown}
      {region && children ? createPortal(children, region) : null}
    </>
  );
}

function ComboboxList({
  className,
  children,
  render,
  ref,
  ...props
}: Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  render?: RenderProp;
  // biome-ignore lint/suspicious/noExplicitAny: Base UI's signature; callers type the item.
  children?: ReactNode | ((item: any, index: number) => ReactNode);
}) {
  const combobox = useCombobox();
  const merged = useMergedRef(ref, combobox.list);
  return useRender(
    'div',
    {
      ref: merged,
      role: 'listbox',
      id: `${combobox.id}-list`,
      'aria-multiselectable': combobox.multiple || undefined,
      'data-slot': 'combobox-list',
      'data-empty': combobox.empty ? '' : undefined,
      // The focus stays in the field while an option is pressed.
      onMouseDown: keepFocus,
      className: cn(
        'no-scrollbar max-h-72 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0',
        className,
      ),
      ...props,
      children:
        typeof children === 'function'
          ? combobox.shown.map((item, at) => children(item, at))
          : children,
    },
    render,
  );
}

function ComboboxItem({
  className,
  children,
  value,
  disabled = false,
  index: _index,
  render,
  onClick,
  ...props
}: ComponentPropsWithRef<'div'> & {
  value?: unknown;
  disabled?: boolean;
  index?: number;
  render?: RenderProp;
}) {
  const combobox = useCombobox();
  const id = useId();
  const highlighted = combobox.highlighted === id;
  const selected = combobox.isSelected(value);
  return useRender(
    'div',
    mergeProps(
      {
        id,
        role: 'option',
        'aria-selected': selected,
        'aria-disabled': disabled || undefined,
        'data-slot': 'combobox-item',
        'data-highlighted': highlighted ? '' : undefined,
        'data-selected': selected ? '' : undefined,
        'data-disabled': disabled ? '' : undefined,
        className: cn(OPTION_ROW, className),
        onPointerMove(event: React.PointerEvent) {
          if (event.pointerType === 'touch' || disabled || highlighted) return;
          combobox.setHighlighted(id);
        },
        onPointerLeave(event: React.PointerEvent) {
          if (event.pointerType !== 'touch' && highlighted) {
            combobox.setHighlighted(null);
          }
        },
      },
      {
        ...props,
        onClick(event: React.MouseEvent<HTMLDivElement>) {
          if (disabled) return;
          onClick?.(event);
          combobox.choose(value, event.nativeEvent);
        },
        children: (
          <>
            {children}
            <span className={cn(TICK_SLOT, 'ml-auto')}>
              {selected && (
                <CheckIcon strokeWidth={1.5} className="pointer-events-none" />
              )}
            </span>
          </>
        ),
      },
    ),
    render,
  );
}

type GroupState = { label: string; items: readonly unknown[] | undefined };

const GroupContext = createContext<GroupState | null>(null);

function ComboboxGroup({
  className,
  items,
  render,
  ...props
}: ComponentPropsWithRef<'div'> & {
  items?: readonly unknown[];
  render?: RenderProp;
}) {
  const label = useId();
  return (
    <GroupContext value={{ label, items }}>
      {useRender(
        'div',
        {
          role: 'group',
          'aria-labelledby': label,
          'data-slot': 'combobox-group',
          className: cn(className),
          ...props,
        },
        render,
      )}
    </GroupContext>
  );
}

function ComboboxLabel({
  className,
  render,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  const group = use(GroupContext);
  return useRender(
    'div',
    {
      id: group?.label,
      'data-slot': 'combobox-label',
      className: cn(SECTION_LABEL, 'pl-2', className),
      ...props,
    },
    render,
  );
}

/** Draws the items of its group (or of the list) with `children`. */
function ComboboxCollection({
  children,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: Base UI's signature; callers type the item.
  children: (item: any, index: number) => ReactNode;
}) {
  const combobox = useCombobox();
  const items = use(GroupContext)?.items ?? combobox.shown;
  return items.map((item, at) => children(item, at));
}

function ComboboxEmpty({
  className,
  children,
  render,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  const combobox = useCombobox();
  const said = combobox.empty ? children : null;
  const shown = useRender(
    'div',
    {
      'data-slot': 'combobox-empty',
      className: cn(
        'hidden w-full justify-center py-2 text-center text-sm text-muted group-data-empty/combobox-content:flex',
        className,
      ),
      ...props,
      // Shown when the list empties; read out from the combobox's status
      // region.
      'aria-hidden': true,
      children: said,
    },
    render,
  );
  return (
    <>
      {shown}
      {combobox.region && said ? createPortal(said, combobox.region) : null}
    </>
  );
}

function ComboboxSeparator({
  className,
  render,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  return useRender(
    'div',
    {
      role: 'separator',
      'aria-orientation': 'horizontal',
      'data-slot': 'combobox-separator',
      className: cn(MENU_SEPARATOR, className),
      ...props,
    },
    render,
  );
}

// --- Chips (multiple) --------------------------------------------------------

function ComboboxChips({
  className,
  render,
  ref,
  onMouseDown,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  const combobox = useCombobox();
  const merged = useMergedRef(ref, combobox.setTrigger);
  return useRender(
    'div',
    {
      ref: merged,
      'data-slot': 'combobox-chips',
      className: cn(
        // A field (DESIGN.md, section 3) that grows in height with its chips.
        `flex min-h-8 flex-wrap items-center gap-1 rounded-md bg-page px-3 py-1 text-sm text-foreground transition-shadow ${FIELD_WRAPPER_EDGE} has-data-[slot=combobox-chip]:pl-2`,
        className,
      ),
      // A press on the box, between the chips, goes to the field.
      onMouseDown(event: React.MouseEvent<HTMLDivElement>) {
        onMouseDown?.(event);
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        combobox.input.current?.focus();
      },
      ...props,
    },
    render,
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  render,
  ...props
}: ComponentPropsWithRef<'div'> & {
  showRemove?: boolean;
  render?: RenderProp;
}) {
  const combobox = useCombobox();
  // The remove button is named "Remove" and the chip's text: "Remove
  // Design", so each one says which chip it takes away.
  const id = useId();
  return useRender(
    'div',
    {
      'data-slot': 'combobox-chip',
      className: cn(
        CHIP,
        'has-disabled:pointer-events-none has-disabled:text-muted has-data-[slot=combobox-chip-remove]:pr-0.5',
        className,
      ),
      ...props,
      children: (
        <>
          <span id={`${id}-label`} className="contents">
            {children}
          </span>
          {showRemove && (
            <Button
              variant="ghost"
              size="icon-xs"
              tabIndex={-1}
              id={`${id}-remove`}
              aria-label="Remove"
              aria-labelledby={`${id}-remove ${id}-label`}
              disabled={combobox.disabled}
              className="size-5 rounded-sm text-muted hover:text-foreground"
              data-slot="combobox-chip-remove"
              onMouseDown={keepFocus}
              onClick={(event) => {
                // The chip's place among the chips is its value's.
                const chip = event.currentTarget.closest(
                  '[data-slot=combobox-chip]',
                );
                const chips = [
                  ...(chip
                    ?.closest('[data-slot=combobox-chips]')
                    ?.querySelectorAll('[data-slot=combobox-chip]') ?? []),
                ];
                const at = chip ? chips.indexOf(chip) : -1;
                if (at >= 0) combobox.remove(at, event.nativeEvent);
              }}
            >
              <XIcon strokeWidth={1.5} className="pointer-events-none" />
            </Button>
          )}
        </>
      ),
    },
    render,
  );
}

/**
 * After the first `limit` chips: "+3 more", so the chips stay on one line.
 * Draw only the first `limit` chips yourself:
 *
 *   <ComboboxValue>
 *     {(values) => values.slice(0, 2).map((v) => <ComboboxChip …>)}
 *   </ComboboxValue>
 *   <ComboboxChipsMore limit={2} />
 *
 * The hidden values stay chosen (ticked in the list); Backspace removes the
 * last one.
 */
function ComboboxChipsMore({
  limit,
  className,
  ...props
}: ComponentPropsWithRef<'span'> & { limit: number }) {
  const combobox = useCombobox();
  const hidden = combobox.selected.slice(limit);
  if (!hidden.length) return null;
  const names = hidden.map(combobox.labelOf).join(', ');
  return (
    <span
      data-slot="combobox-chips-more"
      title={names}
      className={cn(CHIP, 'text-muted', className)}
      {...props}
    >
      +{hidden.length} more
      <span className="sr-only">: {names}</span>
    </span>
  );
}

function ComboboxChipsInput({
  className,
  ...props
}: ComponentPropsWithRef<'input'>) {
  const combobox = useCombobox();
  return (
    <input
      data-slot="combobox-chip-input"
      className={cn(
        'min-w-16 flex-1 bg-transparent outline-none placeholder:text-muted',
        className,
      )}
      {...useInputProps(combobox, props)}
    />
  );
}

function useComboboxAnchor() {
  return useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxButton,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxChipsMore,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
