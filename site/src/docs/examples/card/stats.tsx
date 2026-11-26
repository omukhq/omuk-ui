import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from 'omuk-ui/card';

const STATS = [
  { label: 'Visitors', value: '12,480', change: 8, period: 'last week' },
  { label: 'Sign-ups', value: '342', change: 12, period: 'last week' },
  { label: 'Refunds', value: '7', change: -3, period: 'last week' },
];

export default function CardStats() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {STATS.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardTitle className="font-normal text-muted">
              {stat.label}
            </CardTitle>
            <CardAction>This week</CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tabular-nums">
              {stat.value}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted">
              {stat.change >= 0 ? (
                <TrendingUpIcon
                  strokeWidth={1.5}
                  className="size-4"
                  aria-hidden
                />
              ) : (
                <TrendingDownIcon
                  strokeWidth={1.5}
                  className="size-4"
                  aria-hidden
                />
              )}
              {stat.change >= 0 ? 'Up' : 'Down'} {Math.abs(stat.change)}% from{' '}
              {stat.period}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
