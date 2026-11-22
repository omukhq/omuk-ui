import { Button } from '@omuk/ui/button';
import { toast } from '@omuk/ui/sonner';

export default function ToastKinds() {
  return (
    <>
      <Button variant="outline" onClick={() => toast('Draft saved')}>
        Plain
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Invite sent', {
            description: 'Ada can join until Friday.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('The file did not upload', {
            description: 'It is over 10 MB. Choose a smaller file.',
          })
        }
      >
        Error
      </Button>
    </>
  );
}
