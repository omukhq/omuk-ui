import { Spinner } from '@omuk/ui/spinner';

export default function SpinnerBlock() {
  return (
    <section className="flex w-full max-w-sm flex-col gap-3 rounded-xl p-4 inset-ring inset-ring-border">
      <h3 className="text-sm font-semibold text-foreground">Activity</h3>
      <div className="flex h-32 items-center justify-center">
        <Spinner className="size-6" aria-label="Loading the activity" />
      </div>
    </section>
  );
}
