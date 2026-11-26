import { Button } from 'omuk-ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from 'omuk-ui/drawer';
import { Playground } from '../../playground';

const DIRECTIONS = ['left', 'right', 'top', 'bottom'] as const;

type Values = {
  direction: (typeof DIRECTIONS)[number];
  title: string;
  description: string;
  closeLabel: string;
};

const INITIAL: Values = {
  direction: 'right',
  title: 'Activity',
  description: 'Escape, a click on the backdrop or Close puts it away.',
  closeLabel: 'Close',
};

function code(values: Values) {
  const direction =
    values.direction === INITIAL.direction
      ? ''
      : ` direction="${values.direction}"`;
  return `import { Button } from 'omuk-ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from 'omuk-ui/drawer';

<Drawer${direction}>
  <DrawerTrigger render={<Button variant="outline" />}>
    Open the drawer
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>${values.title}</DrawerTitle>
      <DrawerDescription>${values.description}</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <DrawerClose render={<Button variant="outline" />}>
        ${values.closeLabel}
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`;
}

export default function DrawerPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'direction', kind: 'choice', options: DIRECTIONS },
        { name: 'title', kind: 'text' },
        { name: 'description', kind: 'text' },
        { name: 'closeLabel', kind: 'text' },
      ]}
      render={(values) => (
        <Drawer direction={values.direction}>
          <DrawerTrigger render={<Button variant="outline" />}>
            Open the drawer
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{values.title}</DrawerTitle>
              <DrawerDescription>{values.description}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose render={<Button variant="outline" />}>
                {values.closeLabel}
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      code={code}
    />
  );
}
