import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import type * as React from 'react';
import {
  ContextMenuRoot,
  ContextMenuTriggerPart,
  MenuCheckboxItem,
  MenuGroup,
  MenuItem,
  MenuItemIndicator,
  MenuPopup,
  type MenuPopupProps,
  MenuPortal,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
} from './menu';
import {
  INSET,
  MENU_SEPARATOR,
  POP,
  ROW,
  SECTION_LABEL,
  SHORTCUT,
  SURFACE,
  TICK_SLOT,
} from './recipes';
import { cn } from './utils';

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuRoot>) {
  return <ContextMenuRoot data-slot="context-menu" {...props} />;
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof MenuPortal>) {
  return <MenuPortal {...props} />;
}

function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuTriggerPart>) {
  return (
    <ContextMenuTriggerPart
      data-slot="context-menu-trigger"
      className={cn('select-none', className)}
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  align = 'start',
  alignOffset = 4,
  side = 'right',
  sideOffset = 0,
  ...props
}: MenuPopupProps) {
  return (
    <MenuPopup
      positionerClassName="isolate z-50 outline-none"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      data-slot="context-menu-content"
      className={cn(
        SURFACE,
        POP,
        'z-50 max-h-(--available-height) min-w-48 overflow-x-hidden overflow-y-auto',
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof MenuGroup>) {
  return <MenuGroup data-slot="context-menu-group" {...props} />;
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<'div'> & {
  inset?: boolean;
}) {
  return (
    <div
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        SECTION_LABEL,
        inset && cn('flex items-center gap-2', INSET),
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof MenuItem> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <MenuItem
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        ROW,
        'group/context-menu-item',
        inset && INSET,
        variant === 'destructive' && 'text-danger',
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof MenuSubmenuRoot>) {
  return <MenuSubmenuRoot data-slot="context-menu-sub" {...props} />;
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuSubmenuTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenuSubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(ROW, inset && INSET, 'data-open:bg-hover', className)}
      {...props}
    >
      {children}
      <ChevronRightIcon strokeWidth={1.5} className="ml-auto text-muted" />
    </MenuSubmenuTrigger>
  );
}

function ContextMenuSubContent({
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      side="right"
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof MenuCheckboxItem> & {
  inset?: boolean;
}) {
  return (
    <MenuCheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(ROW, className)}
      checked={checked}
      {...props}
    >
      <span className={TICK_SLOT}>
        <MenuItemIndicator>
          <CheckIcon strokeWidth={1.5} />
        </MenuItemIndicator>
      </span>
      {children}
    </MenuCheckboxItem>
  );
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof MenuRadioGroup>) {
  return <MenuRadioGroup data-slot="context-menu-radio-group" {...props} />;
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenuRadioItem> & {
  inset?: boolean;
}) {
  return (
    <MenuRadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(ROW, className)}
      {...props}
    >
      <span className={TICK_SLOT}>
        <MenuItemIndicator>
          <CheckIcon strokeWidth={1.5} />
        </MenuItemIndicator>
      </span>
      {children}
    </MenuRadioItem>
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuSeparator>) {
  return (
    <MenuSeparator
      data-slot="context-menu-separator"
      className={cn(MENU_SEPARATOR, className)}
      {...props}
    />
  );
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    // Shown, not read: the shortcut is not part of the item's name.
    <span
      aria-hidden
      data-slot="context-menu-shortcut"
      className={cn(SHORTCUT, className)}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
