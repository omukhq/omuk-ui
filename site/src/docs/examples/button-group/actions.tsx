import { Button } from '@omuk/ui/button';
import { ButtonGroup } from '@omuk/ui/button-group';
import { CopyIcon, DownloadIcon, Share2Icon } from 'lucide-react';

export default function ButtonGroupActions() {
  return (
    <ButtonGroup aria-label="Report actions">
      <Button variant="outline">
        <CopyIcon data-icon="inline-start" strokeWidth={1.5} aria-hidden />
        Copy
      </Button>
      <Button variant="outline">
        <DownloadIcon data-icon="inline-start" strokeWidth={1.5} aria-hidden />
        Download
      </Button>
      <Button variant="outline">
        <Share2Icon data-icon="inline-start" strokeWidth={1.5} aria-hidden />
        Share
      </Button>
    </ButtonGroup>
  );
}
