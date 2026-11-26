import { ArchiveIcon, FileTextIcon, InboxIcon, StarIcon } from 'lucide-react';
import { ListRow, ListRowMeta } from 'omuk-ui/list-row';
import { useState } from 'react';

const FOLDERS = [
  { id: 'inbox', name: 'Inbox', icon: InboxIcon, count: 12 },
  { id: 'starred', name: 'Starred', icon: StarIcon, count: 3 },
  { id: 'drafts', name: 'Drafts', icon: FileTextIcon, count: 1 },
  { id: 'archive', name: 'Archive', icon: ArchiveIcon, count: 0 },
];

export default function ListRowSidebar() {
  const [current, setCurrent] = useState('inbox');
  return (
    <nav aria-label="Folders" className="flex w-full max-w-56 flex-col gap-0.5">
      {FOLDERS.map((folder) => (
        <ListRow
          key={folder.id}
          current={folder.id === current}
          onClick={() => setCurrent(folder.id)}
        >
          <folder.icon strokeWidth={1.5} aria-hidden />
          {folder.name}
          {folder.count > 0 && (
            <ListRowMeta className="tabular-nums">{folder.count}</ListRowMeta>
          )}
        </ListRow>
      ))}
    </nav>
  );
}
