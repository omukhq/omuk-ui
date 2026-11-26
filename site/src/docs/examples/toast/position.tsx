import { Button } from 'omuk-ui/button';
import { toast } from 'omuk-ui/sonner';
import {
  POSITIONS,
  setToastPosition,
  useToastPosition,
} from './position-store';

// <Toaster position="top-left" /> and the others. Each button moves this
// page's toasts there and shows one.

export default function ToastPosition() {
  const current = useToastPosition();
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {POSITIONS.map((place) => (
          <Button
            key={place}
            variant="outline"
            aria-pressed={place === current}
            className="aria-pressed:bg-selected"
            onClick={() => {
              setToastPosition(place);
              toast(`Toasts sit at the ${place.replace('-', ' ')}`);
            }}
          >
            {place}
          </Button>
        ))}
      </div>
      <code className="font-mono text-xs text-muted">
        {`<Toaster position="${current}" />`}
      </code>
    </div>
  );
}
