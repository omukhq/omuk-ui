import { FileTextIcon } from 'lucide-react';
import { ListRow, ListRowMeta } from 'omuk-ui/list-row';
import { Playground } from '../../playground';

type Values = {
  children: string;
  current: boolean;
  level: number;
  icon: boolean;
  meta: string;
  disabled: boolean;
};

const INITIAL: Values = {
  children: 'Release notes',
  current: true,
  level: 0,
  icon: true,
  meta: '2 min',
  disabled: false,
};

function code({ children, current, level, icon, meta, disabled }: Values) {
  const attributes = [
    current && ' current',
    level > 0 && ` level={${level}}`,
    disabled && ' disabled',
  ];
  const lines = [
    icon && '<FileTextIcon strokeWidth={1.5} aria-hidden />',
    children,
    meta && `<ListRowMeta>${meta}</ListRowMeta>`,
  ];
  const imports = meta ? 'ListRow, ListRowMeta' : 'ListRow';
  const iconImport = icon
    ? "\nimport { FileTextIcon } from 'lucide-react';"
    : '';
  return `import { ${imports} } from 'omuk-ui/list-row';${iconImport}

<ListRow${attributes.filter(Boolean).join('')}>
  ${lines.filter(Boolean).join('\n  ')}
</ListRow>`;
}

export default function ListRowPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'children', kind: 'text' },
        { name: 'current', kind: 'boolean' },
        { name: 'level', kind: 'number', min: 0, max: 4 },
        { name: 'icon', kind: 'boolean' },
        { name: 'meta', kind: 'text' },
        { name: 'disabled', kind: 'boolean' },
      ]}
      render={({ children, current, level, icon, meta, disabled }) => (
        <div className="w-full max-w-56">
          <ListRow current={current} level={level} disabled={disabled}>
            {icon && <FileTextIcon strokeWidth={1.5} aria-hidden />}
            {children}
            {meta && <ListRowMeta>{meta}</ListRowMeta>}
          </ListRow>
        </div>
      )}
      code={code}
    />
  );
}
