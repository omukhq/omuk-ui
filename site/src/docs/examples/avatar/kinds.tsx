import { BoxIcon } from 'lucide-react';
import { Avatar } from 'omuk-ui/avatar';

export default function AvatarKinds() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Avatar size="lg" userId="user_ada">
          AL
        </Avatar>
        <span className="text-sm">Ada Lovelace, a person</span>
      </div>
      <div className="flex items-center gap-2">
        <Avatar size="lg" kind="app">
          <BoxIcon strokeWidth={1.5} className="size-4" aria-hidden />
        </Avatar>
        <span className="text-sm">Deploy bot, an app</span>
      </div>
      <div className="flex items-center gap-2">
        <Avatar size="lg" kind="team">
          D
        </Avatar>
        <span className="text-sm">Design, a team</span>
      </div>
    </div>
  );
}
