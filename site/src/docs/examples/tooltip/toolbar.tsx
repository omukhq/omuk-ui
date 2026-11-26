import { BoldIcon, ItalicIcon, LinkIcon, UnderlineIcon } from 'lucide-react';
import { Button } from 'omuk-ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'omuk-ui/tooltip';

const TOOLS = [
  { name: 'Bold', keys: '⌘B', Icon: BoldIcon },
  { name: 'Italic', keys: '⌘I', Icon: ItalicIcon },
  { name: 'Underline', keys: '⌘U', Icon: UnderlineIcon },
  { name: 'Add a link', keys: '⌘K', Icon: LinkIcon },
];

export default function TooltipToolbar() {
  return (
    <TooltipProvider delay={600}>
      <div className="flex gap-1">
        {TOOLS.map(({ name, keys, Icon }) => (
          <Tooltip key={name}>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" aria-label={name} />}
            >
              <Icon strokeWidth={1.5} aria-hidden />
            </TooltipTrigger>
            <TooltipContent>
              {name}
              <kbd>{keys}</kbd>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
