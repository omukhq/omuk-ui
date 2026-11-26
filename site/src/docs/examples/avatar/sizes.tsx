import { Avatar } from 'omuk-ui/avatar';

export default function AvatarSizes() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm" userId="user_grace">
        GH
      </Avatar>
      <Avatar size="md" userId="user_grace">
        GH
      </Avatar>
      <Avatar size="lg" userId="user_grace">
        GH
      </Avatar>
      <Avatar size="xl" userId="user_grace">
        GH
      </Avatar>
      <Avatar size="2xl" userId="user_grace">
        GH
      </Avatar>
    </div>
  );
}
