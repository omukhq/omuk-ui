import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Icons from '../examples/button/icons';
import iconsSource from '../examples/button/icons.tsx?raw';
import AsLink from '../examples/button/link';
import linkSource from '../examples/button/link.tsx?raw';
import Loading from '../examples/button/loading';
import loadingSource from '../examples/button/loading.tsx?raw';
import ButtonPlayground from '../examples/button/playground';
import Sizes from '../examples/button/sizes';
import sizesSource from '../examples/button/sizes.tsx?raw';
import Variants from '../examples/button/variants';
import variantsSource from '../examples/button/variants.tsx?raw';

export default function ButtonPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The button and its code follow."
      >
        <ButtonPlayground />
      </DocSection>
      <DocSection
        title="Variants"
        description="One primary button for each surface. Outline for the other actions of a form or a dialog, ghost in toolbars and menus. Destructive offers a delete; danger-confirm is only the last step of one."
      >
        <Example source={variantsSource}>
          <Variants />
        </Example>
      </DocSection>
      <DocSection
        title="Loading"
        description="With isLoading, the label stays in the layout, hidden, and a spinner sits over it: the button keeps its exact size. loadingLabel is what a screen reader hears meanwhile. Press Save changes."
      >
        <Example source={loadingSource}>
          <Loading />
        </Example>
      </DocSection>
      <DocSection
        title="Sizes"
        description="32 tall by default, like every field, so a button and an input line up. Large is 36. Extra small (24) is for row actions in a dense table only."
      >
        <Example source={sizesSource}>
          <Sizes />
        </Example>
      </DocSection>
      <DocSection
        title="With an icon"
        description="Mark the icon with data-icon: the padding on that side drops one step, so the text and the icon look centred."
      >
        <Example source={iconsSource}>
          <Icons />
        </Example>
      </DocSection>
      <DocSection
        title="As a link"
        description="render draws the button as another element and keeps its look. Set nativeButton to false when that element is not a <button>."
      >
        <Example source={linkSource}>
          <AsLink />
        </Example>
      </DocSection>
      <DocSection title="Props" description="And every prop of a <button>.">
        <PropsTable
          rows={[
            {
              name: 'variant',
              type: "'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'danger-confirm' | 'link'",
              default: "'default'",
              description: 'The look. secondary is the same as outline.',
            },
            {
              name: 'size',
              type: "'xs' | 'sm' | 'md' | 'lg' | 'icon-xs' | 'icon-sm' | 'icon' | 'icon-lg'",
              default: "'md'",
              description:
                'The height: xs 24, sm 28, md 32, lg 36, as the fields of the same size. The icon sizes are squares.',
            },
            {
              name: 'isLoading',
              type: 'boolean',
              default: 'false',
              description:
                'Shows the spinner over the hidden label and disables the button. The size stays the same. Sets data-loading.',
            },
            {
              name: 'loadingLabel',
              type: 'string',
              default: "'Loading'",
              description:
                'The button’s name for a screen reader while it loads.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'Draws the button as this element (a link, a router link), with the button’s props and ref merged in.',
            },
            {
              name: 'nativeButton',
              type: 'boolean',
              default: 'true',
              description:
                'False when render draws something other than a <button>: the button then gets role="button" and answers to Enter and Space.',
            },
            {
              name: 'focusableWhenDisabled',
              type: 'boolean',
              default: 'false',
              description:
                'Keeps a disabled button in the Tab order, with aria-disabled, so a tooltip on it can still be read.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Enter', 'Presses the button.'],
            ['Space', 'Presses the button.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'A disabled button is never just faded: buttons with a fill or an edge take the hover fill and a muted label, so it reads as off in light and dark mode.',
            'Do not swap the label for a longer one (“Save” to “Saving…”) while it works: use isLoading, so nothing around the button moves.',
            'On a touch screen, an extra-small button keeps a 32 target around it.',
          ]}
        />
      </DocSection>
    </>
  );
}
