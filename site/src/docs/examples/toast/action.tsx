import { Button } from 'omuk-ui/button';
import { toast } from 'omuk-ui/sonner';

export default function ToastAction() {
  function archive() {
    toast('Project archived', {
      action: {
        label: 'Undo',
        onClick: () => toast('Project restored'),
      },
    });
  }

  function deploy() {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1800)), {
      loading: 'Deploying',
      success: 'Deployed to production',
      error: 'The deploy failed',
    });
  }

  return (
    <>
      <Button variant="outline" onClick={archive}>
        With an action
      </Button>
      <Button variant="outline" onClick={deploy}>
        Work in progress
      </Button>
    </>
  );
}
