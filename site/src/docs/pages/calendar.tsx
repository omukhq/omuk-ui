import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Day from '../examples/calendar/day';
import daySource from '../examples/calendar/day.tsx?raw';
import CalendarPlayground from '../examples/calendar/playground';
import Range from '../examples/calendar/range';
import rangeSource from '../examples/calendar/range.tsx?raw';

export default function CalendarPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The calendar and its code follow."
      >
        <CalendarPlayground />
      </DocSection>
      <DocSection
        title="A day"
        description="The value is ISO text, such as 2026-11-23. minValue stops the past; isDateUnavailable crosses out the days that cannot be chosen, here the weekends."
      >
        <Example source={daySource}>
          <Day />
        </Example>
      </DocSection>
      <DocSection
        title="A range"
        description="In range mode, the first click sets one end and the second the other; the days between fill as the pointer moves. The value is { start, end }, always in order."
      >
        <Example source={rangeSource}>
          <Range />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="For a calendar that opens from a field, use Date picker: it passes these on."
      >
        <PropsTable
          rows={[
            {
              name: 'mode',
              type: "'single' | 'range'",
              default: "'single'",
              description: 'One day, or a first and a last day.',
            },
            {
              name: 'value',
              type: 'string | DateRange | null',
              description:
                'The chosen day ("2026-11-23") or range ({ start, end }), when the parent keeps it.',
            },
            {
              name: 'defaultValue',
              type: 'string | DateRange | null',
              description: 'The first value, when the calendar keeps its own.',
            },
            {
              name: 'onChange',
              type: '(value) => void',
              description:
                'Called with the chosen day, or with the range once both ends are chosen.',
            },
            {
              name: 'minValue',
              type: 'string',
              description:
                'The first day that can be chosen; maxValue is the last. The arrows stop at them.',
            },
            {
              name: 'isDateUnavailable',
              type: '(day: string) => boolean',
              description:
                'True for a day that cannot be chosen, such as a holiday. It shows crossed out.',
            },
            {
              name: 'visibleMonths',
              type: 'number',
              default: '1',
              description: 'Months side by side.',
            },
            {
              name: 'pageBehavior',
              type: "'visible' | 'single'",
              default: "'visible'",
              description:
                'Whether Previous and Next move all the visible months or one.',
            },
            {
              name: 'firstDayOfWeek',
              type: 'number',
              description:
                '0 (Sunday) to 6 (Saturday). The language’s by default.',
            },
            {
              name: 'locale',
              type: 'string',
              description:
                'The language of the month and day names. The browser’s by default.',
            },
            {
              name: 'timeZone',
              type: 'string',
              description: 'Where “today” is. The browser’s by default.',
            },
            {
              name: 'isDisabled',
              type: 'boolean',
              default: 'false',
              description:
                'Turns the calendar off. isReadOnly shows the value and allows no change.',
            },
            {
              name: 'autoFocus',
              type: 'boolean',
              default: 'false',
              description:
                'Puts the focus on the chosen day, or today, when the calendar appears.',
            },
          ]}
        />
      </DocSection>
      <DocSection
        title="Keyboard"
        description="The month grid is one Tab stop: the focused day."
      >
        <KeysTable
          rows={[
            ['Arrow Left + Arrow Right', 'Moves a day back or on.'],
            ['Arrow Up + Arrow Down', 'Moves a week back or on.'],
            ['Page Up + Page Down', 'Moves a month back or on.'],
            [
              'Shift + Page Up',
              'Moves a year back; with Page Down, a year on.',
            ],
            ['Home + End', 'Goes to the first or the last day of the week.'],
            ['Enter + Space', 'Chooses the focused day.'],
            ['Escape', 'In a range with one end chosen, lets that end go.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'Today has a light grey fill, and the chosen days the primary fill. The focus ring shows for the keyboard only.',
            'A screen reader hears each day in full, with “Today” and “selected” when they apply, and the new month when it turns.',
            'Gregorian only. The months and the weekdays come from Intl, in the language’s order.',
          ]}
        />
      </DocSection>
    </>
  );
}
