import { Button } from 'omuk-ui/button';

export default function ButtonAsLink() {
  return (
    <Button
      variant="outline"
      render={<a href="https://github.com/omukhq/omuk-ui" />}
      nativeButton={false}
    >
      Read the source
    </Button>
  );
}
