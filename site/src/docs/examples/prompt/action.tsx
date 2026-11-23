import { Button } from '@omuk/ui/button';
import { usePrompt } from '@omuk/ui/prompt';

/** Fails the first time, so the example shows the error in the alert. */
let tries = 0;
async function deleteProject() {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  tries += 1;
  if (tries % 2 === 1) {
    throw new Error('The server did not answer. Try again.');
  }
}

export default function PromptAction() {
  const prompt = usePrompt();

  function confirmDelete() {
    void prompt.open({
      type: 'alert',
      title: 'Delete the project?',
      description: 'Its environments and secrets go too. It cannot be undone.',
      actionLabel: 'Delete',
      loadingLabel: 'Deleting',
      destructive: true,
      onAction: deleteProject,
    });
  }

  return (
    <Button variant="destructive" onClick={confirmDelete}>
      Delete the project
    </Button>
  );
}
