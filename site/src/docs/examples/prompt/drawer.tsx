import { Button } from 'omuk-ui/button';
import { usePrompt } from 'omuk-ui/prompt';

const EVENTS = [
  'Secret DATABASE_URL changed',
  'Token “CI” made',
  'Signed in with a passkey',
];

export default function PromptDrawer() {
  const prompt = usePrompt();

  function openActivity() {
    void prompt.open({
      type: 'drawer',
      direction: 'right',
      title: 'Activity',
      description: 'The last three changes.',
      content: (close) => (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col divide-y">
            {EVENTS.map((event) => (
              <li key={event} className="py-3 text-sm text-foreground">
                {event}
              </li>
            ))}
          </ul>
          <Button variant="outline" onClick={() => close()}>
            Close
          </Button>
        </div>
      ),
    });
  }

  return (
    <Button variant="outline" onClick={openActivity}>
      Show the activity
    </Button>
  );
}
