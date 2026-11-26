import { Button } from 'omuk-ui/button';

export default function ButtonVariants() {
  return (
    <>
      <Button>Save</Button>
      <Button variant="outline">Export</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="danger-confirm">Delete for good</Button>
      <Button variant="link">Learn more</Button>
    </>
  );
}
