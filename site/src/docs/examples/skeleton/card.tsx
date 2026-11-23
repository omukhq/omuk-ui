import { Button } from '@omuk/ui/button';
import { Skeleton } from '@omuk/ui/skeleton';
import { useState } from 'react';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function SkeletonCard() {
  const [loading, setLoading] = useState(false);

  async function reload() {
    setLoading(true);
    await wait(2000);
    setLoading(false);
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-4">
      <div
        aria-busy={loading}
        className="flex w-full items-center gap-3 rounded-xl p-4 inset-ring inset-ring-border"
      >
        {loading ? (
          <>
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-1 h-4 w-48" />
            </div>
          </>
        ) : (
          <>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-selected text-sm font-medium text-foreground">
              AR
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium text-foreground">
                Amina Rahman
              </span>
              <span className="mt-1 text-xs text-muted">
                Signed in 4 min. ago on a Mac
              </span>
            </div>
          </>
        )}
      </div>
      <Button variant="outline" disabled={loading} onClick={reload}>
        Reload
      </Button>
    </div>
  );
}
