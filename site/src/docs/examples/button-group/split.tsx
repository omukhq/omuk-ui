import { Button } from '@omuk/ui/button';
import { ButtonGroup, ButtonGroupSeparator } from '@omuk/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@omuk/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

export default function ButtonGroupSplit() {
  return (
    <ButtonGroup aria-label="Merge">
      <Button>Merge pull request</Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button size="icon" aria-label="More ways to merge">
              <ChevronDownIcon strokeWidth={1.5} aria-hidden />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem>Squash and merge</DropdownMenuItem>
          <DropdownMenuItem>Rebase and merge</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
