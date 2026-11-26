import { CopyIcon, FileTextIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from 'omuk-ui/context-menu';

export default function ContextMenuActions() {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        className="flex w-full max-w-sm items-center gap-3 rounded-lg p-3 inset-ring inset-ring-border outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-outline"
      >
        <FileTextIcon
          strokeWidth={1.5}
          className="size-5 text-muted"
          aria-hidden
        />
        <div className="flex min-w-0 flex-col">
          <span className="text-sm font-medium text-foreground">
            .env.production
          </span>
          <span className="text-xs text-muted">
            Right-click, long press, or focus and press Shift+F10
          </span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          <PencilIcon strokeWidth={1.5} aria-hidden />
          Rename
          <ContextMenuShortcut>R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <CopyIcon strokeWidth={1.5} aria-hidden />
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2Icon strokeWidth={1.5} aria-hidden />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
