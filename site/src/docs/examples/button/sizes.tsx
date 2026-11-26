import { SettingsIcon } from 'lucide-react';
import { Button } from 'omuk-ui/button';

export default function ButtonSizes() {
  return (
    <>
      <Button size="xs" variant="outline">
        Extra small
      </Button>
      <Button size="sm" variant="outline">
        Small
      </Button>
      <Button variant="outline">Default</Button>
      <Button size="lg" variant="outline">
        Large
      </Button>
      <Button size="icon" variant="outline" aria-label="Settings">
        <SettingsIcon strokeWidth={1.5} />
      </Button>
    </>
  );
}
