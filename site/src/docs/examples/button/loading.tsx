import { Button } from '@omuk/ui/button';
import { useState } from 'react';

export default function ButtonLoading() {
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSaving(false);
  }

  return (
    <>
      <Button isLoading={saving} loadingLabel="Saving" onClick={save}>
        Save changes
      </Button>
      <Button variant="ghost">Cancel</Button>
    </>
  );
}
