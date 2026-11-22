import { Button } from '@omuk/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@omuk/ui/drawer';

const DIRECTIONS = [
  { direction: 'left', label: 'From the left' },
  { direction: 'right', label: 'From the right' },
  { direction: 'top', label: 'From the top' },
  { direction: 'bottom', label: 'From the bottom' },
] as const;

export default function DrawerDirections() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {DIRECTIONS.map(({ direction, label }) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger render={<Button variant="outline" />}>
            {label}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{label}</DrawerTitle>
              <DrawerDescription>
                Escape, a click on the backdrop or Close puts it away.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose render={<Button variant="outline" />}>
                Close
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}
