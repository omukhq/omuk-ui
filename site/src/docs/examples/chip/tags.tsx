import { Chip } from '@omuk/ui/chip';

export default function ChipTags() {
  return (
    <div className="flex flex-wrap gap-1">
      <Chip>Billing</Chip>
      <Chip>Mobile app</Chip>
      <Chip>Needs review</Chip>
    </div>
  );
}
