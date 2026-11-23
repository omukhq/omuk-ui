import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@omuk/ui/pagination';
import { type MouseEvent, useState } from 'react';

const TOTAL = 134;
const PAGE_SIZE = 20;
const LAST_PAGE = Math.ceil(TOTAL / PAGE_SIZE);

export default function PaginationRange() {
  const [page, setPage] = useState(2);

  function go(next: number) {
    return (event: MouseEvent) => {
      event.preventDefault();
      if (next >= 1 && next <= LAST_PAGE) setPage(next);
    };
  }

  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, TOTAL);
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <p className="text-sm text-muted tabular-nums">
        {first}–{last} of {TOTAL} projects
      </p>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${page - 1}`}
              disabled={page === 1}
              onClick={go(page - 1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`?page=${page + 1}`}
              disabled={page === LAST_PAGE}
              onClick={go(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
