import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Day from '../examples/date-picker/day';
import daySource from '../examples/date-picker/day.tsx?raw';
import DayAndTime from '../examples/date-picker/day-and-time';
import dayAndTimeSource from '../examples/date-picker/day-and-time.tsx?raw';
import Range from '../examples/date-picker/range';
import rangeSource from '../examples/date-picker/range.tsx?raw';
import Time from '../examples/date-picker/time';
import timeSource from '../examples/date-picker/time.tsx?raw';

export default function DatePickerPage() {
  return (
    <>
      <DocSection
        title="A day"
        description="The value is ISO text, such as 2026-12-04. Type the parts in the language’s order, step them with the arrow keys, or open the calendar from the button in the field."
      >
        <Example source={daySource}>
          <Day />
        </Example>
      </DocSection>
      <DocSection
        title="A day and a time"
        description="With granularity set to minute, the field adds the hour and the minute, and the value becomes 2026-12-01T09:30. The calendar stays open after a pick, so the time can follow."
      >
        <Example source={dayAndTimeSource}>
          <DayAndTime />
        </Example>
      </DocSection>
      <DocSection
        title="A range with presets"
        description="In range mode, the value is a start and an end. Presets sit beside the calendar and pick a whole range at once; maxValue stops the range at today."
      >
        <Example source={rangeSource}>
          <Range />
        </Example>
      </DocSection>
      <DocSection
        title="A time"
        description="In time mode, there is no calendar, and the value is 14:30. The hours are 12 or 24 by the language, or as hourCycle says. showClear adds a clear button while there is a value."
      >
        <Example source={timeSource}>
          <Time />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="One component in three modes. The type of the value follows mode; the calendar options do not apply to a time."
      >
        <PropsTable
          rows={[
            {
              name: 'mode',
              type: "'date' | 'range' | 'time'",
              default: "'date'",
              description:
                'A day (or a day and a time), a first and a last day, or a time.',
            },
            {
              name: 'granularity',
              type: "'day' | 'minute'",
              default: "'day'",
              description: 'Date mode: minute adds the time to the day.',
            },
            {
              name: 'value',
              type: 'string | DateRange | null',
              description:
                'The value, when the parent keeps it: "2026-11-18", "2026-11-18T14:30", { start, end } or "14:30". defaultValue when the picker keeps its own.',
            },
            {
              name: 'onChange',
              type: '(value) => void',
              description:
                'Called with the new value, or null when the field is cleared or not whole. A range typed backwards gives null and marks the field invalid.',
            },
            {
              name: 'presets',
              type: '{ label, range }[]',
              description:
                'Range mode: shortcuts beside the calendar, such as “Last 7 days”.',
            },
            {
              name: 'minValue',
              type: 'string',
              description:
                'The first day that can be chosen. maxValue is the last. isDateUnavailable turns off single days.',
            },
            {
              name: 'visibleMonths',
              type: 'number',
              default: '1',
              description:
                'Months side by side in the calendar. pageBehavior says whether Next moves all of them or one.',
            },
            {
              name: 'shouldCloseOnSelect',
              type: 'boolean',
              description:
                'Closes the calendar on a pick. By default it closes, except for a day and a time.',
            },
            {
              name: 'placeholder',
              type: 'string',
              description:
                'Shown in place of the empty parts until the field is used, for a filter (“Updated”). prefix puts text before the value (“Updated:”).',
            },
            {
              name: 'showClear',
              type: 'boolean',
              default: 'false',
              description:
                'A clear button in the field while there is a value.',
            },
            {
              name: 'validate',
              type: '(value) => string | null',
              description:
                'An error message for the value, shown under the field, or null when it is fine.',
            },
            {
              name: 'name',
              type: 'string',
              description:
                'Sends the ISO text with a form, in a hidden input. startName and endName in range mode.',
            },
            {
              name: 'locale',
              type: 'string',
              description:
                'The language: the parts’ order, the names, 12 or 24 hours, the first day of the week. The browser’s by default.',
            },
            {
              name: 'timeZone',
              type: 'string',
              description:
                'Where “today” is. The browser’s by default. The value never holds a time zone.',
            },
            {
              name: 'hourCycle',
              type: '12 | 24',
              description: 'Overrides the language’s 12 or 24 hours.',
            },
            {
              name: 'firstDayOfWeek',
              type: 'number',
              description:
                '0 (Sunday) to 6 (Saturday). The language’s by default.',
            },
            {
              name: 'align',
              type: "'start' | 'end'",
              default: "'start'",
              description:
                'Which edge of the field the calendar lines up with. Use end for a field near the right edge.',
            },
            {
              name: 'isDisabled',
              type: 'boolean',
              default: 'false',
              description:
                'Turns the field off. isReadOnly, isRequired and isInvalid work the same way.',
            },
            {
              name: 'aria-label',
              type: 'string',
              description:
                'Names the field. “Date”, “Date and time”, “Dates” or “Time” by default.',
            },
          ]}
        />
      </DocSection>
      <DocSection
        title="Keyboard"
        description="In the field. The calendar’s keys are on the Calendar page."
      >
        <KeysTable
          rows={[
            [
              '0–9',
              'Types the part; the focus moves on when the part is whole.',
            ],
            ['Arrow Up + Arrow Down', 'Steps the part up or down.'],
            ['Page Up + Page Down', 'Steps the part by a bigger amount.'],
            ['Home + End', 'Sets the part to its lowest or highest value.'],
            ['Arrow Left + Arrow Right', 'Moves to the part before or after.'],
            [
              'Backspace',
              'Takes the last digit off; in an empty part, moves back.',
            ],
            [
              'Escape',
              'Closes the calendar; the focus goes back to the field.',
            ],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'Gregorian dates only, and no seconds. The value has no time zone: “14:30” is the time the person typed.',
            'The field keeps its size while the calendar opens: the placeholder stays until someone types in a part.',
            'For a filter in a toolbar, pass placeholder, prefix and showClear, and a className of w-fit so the field fits its value.',
          ]}
        />
      </DocSection>
    </>
  );
}
