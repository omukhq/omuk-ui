import { Separator } from '@omuk/ui/separator';

export default function SeparatorVertical() {
  return (
    <div className="flex h-5 items-center gap-3 text-sm text-muted">
      <span>Updated 4 min. ago</span>
      <Separator orientation="vertical" />
      <span>12 secrets</span>
      <Separator orientation="vertical" />
      <span>Production</span>
    </div>
  );
}
