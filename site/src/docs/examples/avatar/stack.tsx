import { Avatar, AvatarCount, AvatarStack } from 'omuk-ui/avatar';

const PEOPLE = [
  { id: 'user_ada', name: 'Ada Lovelace', initials: 'AL' },
  { id: 'user_grace', name: 'Grace Hopper', initials: 'GH' },
  { id: 'user_linus', name: 'Linus Torvalds', initials: 'LT' },
  { id: 'user_margaret', name: 'Margaret Hamilton', initials: 'MH' },
  { id: 'user_alan', name: 'Alan Turing', initials: 'AT' },
  { id: 'user_katherine', name: 'Katherine Johnson', initials: 'KJ' },
];

const SHOWN = 3;

export default function AvatarStackExample() {
  const hidden = PEOPLE.length - SHOWN;
  return (
    <div className="flex items-center gap-2">
      <AvatarStack>
        {PEOPLE.slice(0, SHOWN).map((person) => (
          <Avatar
            key={person.id}
            size="lg"
            userId={person.id}
            title={person.name}
          >
            {person.initials}
          </Avatar>
        ))}
        <AvatarCount size="lg" count={hidden} />
      </AvatarStack>
      <span className="text-sm text-muted">
        {PEOPLE.length} people can edit
      </span>
    </div>
  );
}
