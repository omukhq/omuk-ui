import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@omuk/ui/context-menu';
import { useState } from 'react';

export default function ContextMenuChoices() {
  const [sort, setSort] = useState('name');
  const [hidden, setHidden] = useState(false);
  const [size, setSize] = useState('medium');

  return (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        className="flex h-40 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-sm text-muted outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-outline"
      >
        Right-click in this folder
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>Sort by</ContextMenuLabel>
        <ContextMenuRadioGroup value={sort} onValueChange={setSort}>
          <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
          <ContextMenuRadioItem value="updated">
            Last updated
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={hidden} onCheckedChange={setHidden}>
          Show hidden files
        </ContextMenuCheckboxItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Icon size</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuRadioGroup value={size} onValueChange={setSize}>
              <ContextMenuRadioItem value="small">Small</ContextMenuRadioItem>
              <ContextMenuRadioItem value="medium">Medium</ContextMenuRadioItem>
              <ContextMenuRadioItem value="large">Large</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
