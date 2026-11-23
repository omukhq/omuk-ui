import { Button } from '@omuk/ui/button';
import { Input } from '@omuk/ui/input';
import { Label } from '@omuk/ui/label';
import { usePrompt } from '@omuk/ui/prompt';
import { useId, useState } from 'react';

function RenameForm({
  current,
  onDone,
}: {
  current: string;
  onDone: (name?: string) => void;
}) {
  const id = useId();
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const name = new FormData(event.currentTarget).get('name');
        onDone(typeof name === 'string' ? name.trim() : undefined);
      }}
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>Name</Label>
        <Input id={id} name="name" defaultValue={current} autoFocus required />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onDone()}>
          Cancel
        </Button>
        <Button type="submit">Rename</Button>
      </div>
    </form>
  );
}

export default function PromptModal() {
  const prompt = usePrompt();
  const [name, setName] = useState('Billing');

  async function rename() {
    const next = await prompt.open<string>({
      type: 'modal',
      title: 'Rename the project',
      content: (close) => <RenameForm current={name} onDone={close} />,
    });
    if (next) setName(next);
  }

  return (
    <div className="flex items-center gap-4">
      <p className="font-medium text-foreground">{name}</p>
      <Button variant="outline" onClick={rename}>
        Rename
      </Button>
    </div>
  );
}
