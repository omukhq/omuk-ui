import { cn } from '@omuk/ui/utils';
import type { ReactNode } from 'react';

/**
 * One section of the page: its title (an h2, with an anchor), one line on
 * what it holds, and its content. Sections are split by a divider.
 */
export function Section({
  id,
  title,
  description,
  className,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t">
      <div
        className={cn(
          'mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 sm:px-6',
          className,
        )}
      >
        <div className="flex max-w-reading flex-col gap-2">
          <h2
            id={`${id}-title`}
            className="text-xl font-semibold text-foreground"
          >
            {title}
          </h2>
          {description && (
            <p className="text-base text-pretty text-muted">{description}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
