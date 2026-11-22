import { Button } from '@omuk/ui/button';
import { Input } from '@omuk/ui/input';
import { Label } from '@omuk/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@omuk/ui/popover';
import { PencilIcon } from 'lucide-react';
import { type FormEvent, useState } from 'react';

export default function PopoverRename() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Staging');

  function rename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new FormData(event.currentTarget).get('name');
    if (typeof next === 'string' && next.trim()) setName(next.trim());
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" />}>
        <PencilIcon data-icon="inline-start" strokeWidth={1.5} aria-hidden />
        {name}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <form onSubmit={rename} className="flex flex-col gap-3 p-3">
          <PopoverTitle>Rename the environment</PopoverTitle>
          <div className="flex flex-col gap-2">
            <Label htmlFor="environment-name">Name</Label>
            <Input id="environment-name" name="name" defaultValue={name} />
          </div>
          <Button type="submit" className="self-end">
            Rename
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
