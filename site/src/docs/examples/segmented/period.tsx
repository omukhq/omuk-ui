import { Segmented, SegmentedItem } from '@omuk/ui/segmented';

export default function SegmentedPeriod() {
  return (
    <Segmented aria-label="Period" defaultValue="week">
      <SegmentedItem value="day">Day</SegmentedItem>
      <SegmentedItem value="week">Week</SegmentedItem>
      <SegmentedItem value="month">Month</SegmentedItem>
      <SegmentedItem value="year" disabled>
        Year
      </SegmentedItem>
    </Segmented>
  );
}
