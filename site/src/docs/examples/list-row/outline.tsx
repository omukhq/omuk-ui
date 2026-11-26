import { ListRow } from 'omuk-ui/list-row';
import { useState } from 'react';

const HEADINGS = [
  { id: 'install', text: 'Install', level: 0 },
  { id: 'tokens', text: 'Tokens and fonts', level: 0 },
  { id: 'colours', text: 'Colours', level: 1 },
  { id: 'dark-mode', text: 'Dark mode', level: 2 },
  { id: 'type', text: 'Type', level: 1 },
  { id: 'components', text: 'Components', level: 0 },
];

export default function ListRowOutline() {
  const [current, setCurrent] = useState('colours');
  return (
    <nav aria-label="On this page" className="flex w-full max-w-64 flex-col">
      {HEADINGS.map((heading) => (
        <ListRow
          key={heading.id}
          level={heading.level}
          current={heading.id === current}
          render={<a href={`#${heading.id}`} />}
          onClick={() => setCurrent(heading.id)}
        >
          <span className="truncate">{heading.text}</span>
        </ListRow>
      ))}
    </nav>
  );
}
