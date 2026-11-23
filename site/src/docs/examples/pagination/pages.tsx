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

const LAST_PAGE = 12;

/** The first page, the current one and its neighbours, and the last. */
function pagesAround(current: number, last: number) {
  const pages = [1, current - 1, current, current + 1, last].filter(
    (page) => page >= 1 && page <= last,
  );
  return [...new Set(pages)];
}

export default function PaginationPages() {
  const [current, setCurrent] = useState(5);

  function go(page: number) {
    return (event: MouseEvent) => {
      event.preventDefault();
      if (page >= 1 && page <= LAST_PAGE) setCurrent(page);
    };
  }

  const pages = pagesAround(current, LAST_PAGE);
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
        {pages.map((page, index) => (
          <PaginationItem key={page} className="flex gap-1">
            {index > 0 && page - (pages[index - 1] ?? 0) > 1 && (
              <PaginationEllipsis />
            )}
            <PaginationLink
              href={`?page=${page}`}
              isActive={page === current}
              onClick={go(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={`?page=${current + 1}`}
            disabled={current === LAST_PAGE}
            onClick={go(current + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
