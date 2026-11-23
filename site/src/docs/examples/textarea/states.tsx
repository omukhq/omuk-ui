import { Textarea } from '@omuk/ui/textarea';

export default function TextareaStates() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Textarea aria-label="Empty" placeholder="Empty" />
      <Textarea
        aria-label="A long key"
        className="font-mono"
        defaultValue="example_key_7Gm2vK9pLwR4tY8uE3oI6aS1dF0gH5jK7lZ2xC4vB9nMqQb"
      />
      <Textarea aria-label="Disabled" defaultValue="Disabled" disabled />
      <Textarea aria-label="Read only" defaultValue="Read only" readOnly />
    </div>
  );
}
