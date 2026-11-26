'use client';

import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuItem,
  MenuItemIndicator,
  MenuPopup,
  type MenuPopupProps,
  MenuPortal,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRoot,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuTrigger,
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

function DropdownMenu({ ...props }: React.ComponentProps<typeof MenuRoot>) {
  return <MenuRoot data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof MenuPortal>) {
  return <MenuPortal {...props} />;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof MenuTrigger>) {
  return <MenuTrigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  className,
  ...props
}: MenuPopupProps) {
  return (
    <MenuPopup
      positionerClassName="isolate z-50 outline-none"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      data-slot="dropdown-menu-content"
      // DESIGN.md, section 3, Menu: `p-1 rounded-lg bg-page shadow-sm`.
      className={cn(
        SURFACE,
        POP,
        'z-50 max-h-(--available-height) w-(--anchor-width) min-w-48 overflow-x-hidden overflow-y-auto',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof MenuGroup>) {
  return <MenuGroup data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<'div'> & {
  inset?: boolean;
}) {
  return (
    <div
      data-slot="dropdown-menu-label"
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

function DropdownMenuItem({
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
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        ROW,
        'group/dropdown-menu-item',
        inset && INSET,
        variant === 'destructive' && 'text-danger',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof MenuSubmenuRoot>) {
  return <MenuSubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuSubmenuTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenuSubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        ROW,
        inset && INSET,
        'data-popup-open:bg-hover data-open:bg-hover',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon strokeWidth={1.5} className="ml-auto text-muted" />
    </MenuSubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = 'start',
  alignOffset = -4,
  side = 'right',
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn('w-auto min-w-48', className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
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
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(ROW, className)}
      checked={checked}
      {...props}
    >
      <span
        className={TICK_SLOT}
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuItemIndicator>
          <CheckIcon strokeWidth={1.5} />
        </MenuItemIndicator>
      </span>
      {children}
    </MenuCheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof MenuRadioGroup>) {
  return <MenuRadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenuRadioItem> & {
  inset?: boolean;
}) {
  return (
    <MenuRadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(ROW, className)}
      {...props}
    >
      <span
        className={TICK_SLOT}
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuItemIndicator>
          <CheckIcon strokeWidth={1.5} />
        </MenuItemIndicator>
      </span>
      {children}
    </MenuRadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuSeparator>) {
  return (
    <MenuSeparator
      data-slot="dropdown-menu-separator"
      className={cn(MENU_SEPARATOR, className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    // Shown, not read: the shortcut is not part of the item's name.
    <span
      aria-hidden
      data-slot="dropdown-menu-shortcut"
      className={cn(SHORTCUT, className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
