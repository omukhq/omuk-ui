import { Button } from '@omuk/ui/button';
import { Input } from '@omuk/ui/input';
import { Label } from '@omuk/ui/label';
import { type FormEvent, useId, useState } from 'react';

/** The modal's form: a new name, then Cancel or Rename. */
export function RenameForm({
  current,
  onDone,
}: {
  current: string;
  onDone: (name?: string) => void;
}) {
  const [name, setName] = useState(current);
  const [saving, setSaving] = useState(false);
  const id = useId();
  const empty = name.trim() === '';

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (empty) return;
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    onDone(name.trim());
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>Name</Label>
        <Input
          id={id}
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={empty || undefined}
          aria-describedby={empty ? `${id}-error` : undefined}
        />
        {empty && (
          <p id={`${id}-error`} className="text-xs text-danger">
            Enter a name.
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onDone()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={saving} loadingLabel="Renaming">
          Rename
        </Button>
      </div>
    </form>
  );
}
