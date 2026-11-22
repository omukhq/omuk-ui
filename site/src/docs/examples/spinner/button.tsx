import { Button } from '@omuk/ui/button';
import { useState } from 'react';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function SpinnerButton() {
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await wait(1500);
    setSaving(false);
  }

  return (
    <Button isLoading={saving} loadingLabel="Saving" onClick={save}>
      Save changes
    </Button>
  );
}
