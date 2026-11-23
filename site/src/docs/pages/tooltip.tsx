import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import TooltipPlayground from '../examples/tooltip/playground';
import Sides from '../examples/tooltip/sides';
import sidesSource from '../examples/tooltip/sides.tsx?raw';
import Toolbar from '../examples/tooltip/toolbar';
import toolbarSource from '../examples/tooltip/toolbar.tsx?raw';

export default function TooltipPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right, then point at the button. delay belongs to the TooltipProvider."
      >
        <TooltipPlayground />
      </DocSection>
      <DocSection
        title="Names for icon buttons"
        description="Each icon button has an aria-label, and the tooltip shows the same name, with its shortcut in a kbd. In a TooltipProvider, one tooltip shows at a time: slide along the row, and the next name shows at once."
      >
        <Example source={toolbarSource}>
          <Toolbar />
        </Example>
      </DocSection>
      <DocSection
        title="Sides"
        description="side picks where it opens. With no room there, it takes the other side. This provider has no delay, so each name shows as soon as the pointer is over its button."
      >
        <Example source={sidesSource}>
          <Sides />
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: 'delay',
              type: 'number',
              default: '0',
              description:
                'TooltipProvider: milliseconds before a tooltip of the group shows on hover. TooltipTrigger takes its own delay, over the provider’s. With no provider, the wait is 600.',
            },
            {
              name: 'closeDelay',
              type: 'number',
              default: '0',
              description:
                'TooltipProvider: milliseconds before it goes after the pointer leaves.',
            },
            {
              name: 'open',
              type: 'boolean',
              description:
                'Tooltip: whether it shows, when the parent keeps it; with onOpenChange.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Tooltip: it never shows.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description: 'TooltipTrigger: the control it names.',
            },
            {
              name: 'closeOnClick',
              type: 'boolean',
              default: 'true',
              description:
                'TooltipTrigger: a press hides it, and it stays hidden until the pointer leaves.',
            },
            {
              name: 'side',
              type: "'top' | 'bottom' | 'left' | 'right'",
              default: "'top'",
              description: 'TooltipContent: the side it opens on.',
            },
            {
              name: 'align',
              type: "'start' | 'center' | 'end'",
              default: "'center'",
              description:
                'TooltipContent: which edge of the trigger it lines up with.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Tab', 'Focus on the trigger shows the tooltip at once.'],
            ['Escape', 'Hides it.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'A tooltip is a name, not content: put nothing in it that a person must read or press. For more, use a Popover.',
            'It does not show on touch, and not while the trigger’s own menu or popover is open.',
            'A screen reader reads the trigger’s aria-label, so give the icon button one with the same words.',
          ]}
        />
      </DocSection>
    </>
  );
}
