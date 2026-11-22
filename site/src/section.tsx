import type { ReactNode } from 'react';

/** The title of one part of the page: an h2, set as display type. */
export function PartTitle({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-title font-semibold text-balance text-foreground"
    >
      {children}
    </h2>
  );
}

/**
 * One part of the page: a divider above, its title, an optional line on
 * what it holds, and its content.
 */
export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t">
      <div className="mx-auto max-w-site px-gutter py-section">
        <PartTitle id={`${id}-title`}>{title}</PartTitle>
        {description && (
          <p className="mt-8 max-w-2xl text-lede text-pretty text-muted">
            {description}
          </p>
        )}
        <div className="mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}
