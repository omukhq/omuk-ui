import { Separator } from 'omuk-ui/separator';

export default function SeparatorHorizontal() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground">Omuk UI</h3>
        <p className="text-sm text-muted">
          Forms, menus, tables and dates for React, in light and dark mode.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground">License</h3>
        <p className="text-sm text-muted">MIT. Use it in any project.</p>
      </div>
    </div>
  );
}
