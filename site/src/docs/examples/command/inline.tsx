import { Command, type CommandItem } from '@omuk/ui/command';
import { useState } from 'react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Pear'];

export default function CommandInline() {
  const [picked, setPicked] = useState('nothing yet');
  const items: CommandItem[] = FRUITS.map((fruit) => ({
    id: fruit.toLowerCase(),
    label: fruit,
    disabled: fruit === 'Cherry',
    onSelect: () => setPicked(fruit),
  }));
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Command
        items={items}
        placeholder="Find a fruit"
        className="rounded-xl inset-ring inset-ring-border"
      />
      <p className="text-sm text-muted">Picked: {picked}</p>
    </div>
  );
}
