import { Spinner } from 'omuk-ui/spinner';

export default function SpinnerInline() {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="flex items-center gap-2 text-sm text-muted">
        <Spinner aria-label="Saving changes" />
        <span aria-hidden>Saving changes</span>
      </p>
      <div className="flex items-center gap-4">
        <Spinner className="size-4" />
        <Spinner className="size-5" />
        <Spinner className="size-6 text-foreground" />
      </div>
    </div>
  );
}
