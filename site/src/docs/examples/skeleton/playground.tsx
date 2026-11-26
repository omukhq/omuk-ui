import { Skeleton } from 'omuk-ui/skeleton';
import { jsx, Playground } from '../../playground';

// The values are whole class names, so Tailwind finds them in this file.
const WIDTHS = ['w-10', 'w-32', 'w-48', 'w-64'] as const;
const HEIGHTS = ['h-4', 'h-5', 'h-10', 'h-24'] as const;
const RADII = ['rounded-sm', 'rounded-lg', 'rounded-full'] as const;

type Values = {
  width: (typeof WIDTHS)[number];
  height: (typeof HEIGHTS)[number];
  radius: (typeof RADII)[number];
};

const INITIAL: Values = {
  width: 'w-48',
  height: 'h-5',
  radius: 'rounded-sm',
};

/** The bar's classes; rounded-sm is the skeleton's own, so it is left out. */
function classes({ width, height, radius }: Values) {
  return [height, width, radius === 'rounded-sm' ? '' : radius]
    .filter(Boolean)
    .join(' ');
}

export default function SkeletonPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'width', kind: 'choice', options: WIDTHS },
        { name: 'height', kind: 'choice', options: HEIGHTS },
        { name: 'radius', kind: 'choice', options: RADII },
      ]}
      render={(values) => <Skeleton className={classes(values)} />}
      code={(values) =>
        `import { Skeleton } from 'omuk-ui/skeleton';\n\n${jsx('Skeleton', { className: classes(values) }, {})}`
      }
    />
  );
}
