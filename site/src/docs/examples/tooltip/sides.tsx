import { Button } from '@omuk/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@omuk/ui/tooltip';

const SIDES = [
  { side: 'top', label: 'Top' },
  { side: 'right', label: 'Right' },
  { side: 'bottom', label: 'Bottom' },
  { side: 'left', label: 'Left' },
] as const;

export default function TooltipSides() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap justify-center gap-2">
        {SIDES.map(({ side, label }) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" />}>
              {label}
            </TooltipTrigger>
            <TooltipContent side={side}>Opens on the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
