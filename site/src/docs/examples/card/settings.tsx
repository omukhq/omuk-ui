import { Button } from '@omuk/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@omuk/ui/card';
import { Input } from '@omuk/ui/input';
import { Label } from '@omuk/ui/label';
import { useId, useState } from 'react';

export default function CardSettings() {
  const id = useId();
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Workspace name</CardTitle>
        <CardDescription>
          People see it in invites and at the top of the sidebar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <Label htmlFor={id}>Name</Label>
        <Input id={id} defaultValue="Northwind" />
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button variant="ghost">Cancel</Button>
        <Button isLoading={saving} loadingLabel="Saving" onClick={save}>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
