import { Badge } from 'omuk-ui/badge';

export default function BadgeVariants() {
  return (
    <>
      <Badge>Draft</Badge>
      <Badge variant="plan">Pro</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="outline">Read only</Badge>
      <Badge variant="ghost">Archived</Badge>
      <Badge variant="link" render={<a href="#changelog" />}>
        New in 1.2
      </Badge>
    </>
  );
}
