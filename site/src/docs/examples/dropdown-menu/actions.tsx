import {
  ChevronDownIcon,
  CopyIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';
import { Button } from 'omuk-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from 'omuk-ui/dropdown-menu';

export default function DropdownMenuActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            Options
            <ChevronDownIcon
              data-icon="inline-end"
              strokeWidth={1.5}
              aria-hidden
            />
          </Button>
        }
      />
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <PencilIcon strokeWidth={1.5} aria-hidden />
          Rename
          <DropdownMenuShortcut>R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon strokeWidth={1.5} aria-hidden />
          Duplicate
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon strokeWidth={1.5} aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
