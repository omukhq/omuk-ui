import { Button } from '@omuk/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@omuk/ui/popover';
import { InfoIcon } from 'lucide-react';

export default function PopoverDetails() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="About tokens" />
        }
      >
        <InfoIcon strokeWidth={1.5} aria-hidden />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-3 p-3">
          <PopoverHeader>
            <div className="flex items-start justify-between gap-2">
              <PopoverTitle>Access tokens</PopoverTitle>
              <PopoverClose className="-mt-1 -mr-1" />
            </div>
            <PopoverDescription>
              A token lets the CLI read one environment. It never shows again
              after you make it, so copy it at once.
            </PopoverDescription>
          </PopoverHeader>
        </div>
      </PopoverContent>
    </Popover>
  );
}
