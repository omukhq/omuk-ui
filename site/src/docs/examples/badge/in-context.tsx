import { LockIcon } from 'lucide-react';
import { Badge } from 'omuk-ui/badge';

export default function BadgeInContext() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-foreground">
          Custom domains
        </h3>
        <Badge variant="plan">Pro</Badge>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-foreground">Production keys</span>
        <Badge>
          <LockIcon strokeWidth={1.5} aria-hidden />
          Secret
        </Badge>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-foreground">Open issues</span>
        <Badge className="tabular-nums">24</Badge>
      </div>
    </div>
  );
}
