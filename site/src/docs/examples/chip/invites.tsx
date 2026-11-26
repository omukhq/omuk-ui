import { Chip } from 'omuk-ui/chip';
import { useState } from 'react';

const INVITES = [
  'ada@example.com',
  'grace@example.com',
  'linus@example.com',
  'margaret@example.com',
];

export default function ChipInvites() {
  const [emails, setEmails] = useState(INVITES);

  function remove(email: string) {
    setEmails(emails.filter((each) => each !== email));
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <p className="text-sm font-medium text-foreground">
        Invites to send ({emails.length})
      </p>
      <div className="flex flex-wrap gap-1">
        {emails.map((email) => (
          <Chip
            key={email}
            onRemove={() => remove(email)}
            removeLabel={`Remove ${email}`}
          >
            {email}
          </Chip>
        ))}
      </div>
      {emails.length === 0 && (
        <p className="text-sm text-muted">No one to invite yet.</p>
      )}
    </div>
  );
}
