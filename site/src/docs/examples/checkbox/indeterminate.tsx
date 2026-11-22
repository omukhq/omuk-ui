import { Checkbox } from '@omuk/ui/checkbox';
import { Label } from '@omuk/ui/label';
import { useId, useState } from 'react';

const SECRETS = ['DATABASE_URL', 'STRIPE_KEY', 'MAIL_PASSWORD'];

export default function CheckboxIndeterminate() {
  const id = useId();
  const [chosen, setChosen] = useState<string[]>(['DATABASE_URL']);
  const all = chosen.length === SECRETS.length;
  const some = chosen.length > 0 && !all;

  function toggle(name: string, on: boolean) {
    setChosen(on ? [...chosen, name] : chosen.filter((each) => each !== name));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${id}-all`}
          checked={all}
          indeterminate={some}
          onCheckedChange={() => setChosen(all || some ? [] : SECRETS)}
        />
        <Label htmlFor={`${id}-all`}>Every secret</Label>
      </div>
      {SECRETS.map((name) => (
        <div key={name} className="flex items-center gap-2 pl-6">
          <Checkbox
            id={`${id}-${name}`}
            checked={chosen.includes(name)}
            onCheckedChange={(on) => toggle(name, on)}
          />
          <Label htmlFor={`${id}-${name}`} className="font-mono font-normal">
            {name}
          </Label>
        </div>
      ))}
    </div>
  );
}
