import { ChevronDownIcon, PlusIcon } from 'lucide-react';
import { Button } from 'omuk-ui/button';

export default function ButtonIcons() {
  return (
    <>
      <Button>
        <PlusIcon data-icon="inline-start" strokeWidth={1.5} aria-hidden />
        New project
      </Button>
      <Button variant="outline">
        More
        <ChevronDownIcon data-icon="inline-end" strokeWidth={1.5} aria-hidden />
      </Button>
    </>
  );
}
