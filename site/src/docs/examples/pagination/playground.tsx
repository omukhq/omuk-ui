import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@omuk/ui/pagination';
import { type MouseEvent, useState } from 'react';
import { Playground } from '../../playground';

type Values = {
  pages: number;
  page: number;
  siblings: number;
  numbers: boolean;
};

const INITIAL: Values = {
  pages: 12,
  page: 5,
  siblings: 1,
  numbers: true,
};

/** The first page, the current one and its neighbours, and the last. */
function pagesAround(current: number, last: number, siblings: number) {
  const pages = [1, last];
  for (let page = current - siblings; page <= current + siblings; page++) {
    pages.push(page);
  }
  const shown = pages.filter((page) => page >= 1 && page <= last);
  return [...new Set(shown)].sort((a, b) => a - b);
}

/** A number the reader typed, kept between `low` and `high`. */
function clamp(value: number, low: number, high: number) {
  return Math.min(Math.max(value, low), high);
}

function Preview({ pages, page, siblings, numbers }: Values) {
  const last = Math.max(pages, 1);
  const [current, setCurrent] = useState(clamp(page, 1, last));

  function go(next: number) {
    return (event: MouseEvent) => {
      event.preventDefault();
      if (next >= 1 && next <= last) setCurrent(next);
    };
  }

  const shown = pagesAround(current, last, Math.max(siblings, 0));
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${current - 1}`}
            disabled={current === 1}
            onClick={go(current - 1)}
          />
        </PaginationItem>
        {numbers &&
          shown.map((number, index) => (
            <PaginationItem key={number} className="flex gap-1">
              {index > 0 && number - (shown[index - 1] ?? 0) > 1 && (
                <PaginationEllipsis />
              )}
              <PaginationLink
                href={`?page=${number}`}
                isActive={number === current}
                onClick={go(number)}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
        <PaginationItem>
          <PaginationNext
            href={`?page=${current + 1}`}
            disabled={current === last}
            onClick={go(current + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/** The page list helper, as the code shows it. */
const HELPER = `

/** The first page, the current one and its neighbours, and the last. */
function pagesAround(current: number, last: number, siblings: number) {
  const pages = [1, last];
  for (let page = current - siblings; page <= current + siblings; page++) {
    pages.push(page);
  }
  const shown = pages.filter((page) => page >= 1 && page <= last);
  return [...new Set(shown)].sort((a, b) => a - b);
}`;

function code({ pages, page, siblings, numbers }: Values) {
  const last = Math.max(pages, 1);
  const imports = numbers
    ? [
        'Pagination',
        'PaginationContent',
        'PaginationEllipsis',
        'PaginationItem',
        'PaginationLink',
        'PaginationNext',
        'PaginationPrevious',
      ]
    : [
        'Pagination',
        'PaginationContent',
        'PaginationItem',
        'PaginationNext',
        'PaginationPrevious',
      ];
  const links = numbers
    ? `
    {pagesAround(current, LAST_PAGE, ${Math.max(siblings, 0)}).map((number, index, shown) => (
      <PaginationItem key={number} className="flex gap-1">
        {index > 0 && number - (shown[index - 1] ?? 0) > 1 && (
          <PaginationEllipsis />
        )}
        <PaginationLink
          href={\`?page=\${number}\`}
          isActive={number === current}
          onClick={go(number)}
        >
          {number}
        </PaginationLink>
      </PaginationItem>
    ))}`
    : '';
  return `import {
  ${imports.join(',\n  ')},
} from '@omuk/ui/pagination';
import { type MouseEvent, useState } from 'react';

const LAST_PAGE = ${last};${numbers ? HELPER : ''}

const [current, setCurrent] = useState(${clamp(page, 1, last)});
function go(page: number) {
  return (event: MouseEvent) => {
    event.preventDefault();
    if (page >= 1 && page <= LAST_PAGE) setCurrent(page);
  };
}

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        href={\`?page=\${current - 1}\`}
        disabled={current === 1}
        onClick={go(current - 1)}
      />
    </PaginationItem>${links}
    <PaginationItem>
      <PaginationNext
        href={\`?page=\${current + 1}\`}
        disabled={current === LAST_PAGE}
        onClick={go(current + 1)}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>`;
}

export default function PaginationPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'pages', kind: 'number', min: 1, max: 99 },
        { name: 'page', kind: 'number', min: 1, max: 99 },
        { name: 'siblings', kind: 'number', min: 0, max: 3 },
        { name: 'numbers', kind: 'boolean' },
      ]}
      render={(values) => (
        // A new page count or start page starts the preview again there.
        <Preview key={`${values.pages}-${values.page}`} {...values} />
      )}
      code={code}
    />
  );
}
