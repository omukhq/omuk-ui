import { Button } from '@omuk/ui/button';
import { usePrompt } from '@omuk/ui/prompt';
import { useState } from 'react';

export default function PromptAlert() {
  const prompt = usePrompt();
  const [answer, setAnswer] = useState('');

  async function discard() {
    const yes = await prompt.open({
      type: 'alert',
      title: 'Discard the draft?',
      description: 'The changes since the last save are lost.',
      actionLabel: 'Discard',
    });
    setAnswer(yes ? 'Discarded.' : 'Kept.');
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={discard}>
        Discard the draft
      </Button>
      <p className="text-sm text-muted" aria-live="polite">
        {answer}
      </p>
    </div>
  );
}
