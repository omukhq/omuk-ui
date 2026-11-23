import { Input } from '@omuk/ui/input';

export default function InputStates() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input aria-label="Empty" placeholder="Empty" />
      <Input aria-label="Filled" defaultValue="Filled" />
      <Input aria-label="Disabled" defaultValue="Disabled" disabled />
      <Input aria-label="Read only" defaultValue="Read only" readOnly />
    </div>
  );
}
