import { Button } from '@omuk/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@omuk/ui/drawer';
import { Input } from '@omuk/ui/input';
import { Label } from '@omuk/ui/label';
import { type FormEvent, useState } from 'react';

export default function DrawerEdit() {
  const [open, setOpen] = useState(false);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={<Button variant="outline" />}>
        Edit the project
      </DrawerTrigger>
      <DrawerContent>
        <form onSubmit={save} className="flex h-full flex-col">
          <DrawerHeader>
            <DrawerTitle>Edit the project</DrawerTitle>
            <DrawerDescription>
              The name shows in the sidebar and in the CLI.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 scrollbar-subtle">
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-name">Name</Label>
              <Input id="project-name" defaultValue="Website" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-slug">Short name</Label>
              <Input id="project-slug" defaultValue="website" />
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit">Save</Button>
            <DrawerClose render={<Button variant="outline" />}>
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
