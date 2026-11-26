import { Status } from 'omuk-ui/status';

export default function StatusTones() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Status tone="success">Live</Status>
      <Status tone="warning">Check this</Status>
      <Status tone="danger">Failed</Status>
      <Status>Paused</Status>
    </div>
  );
}
