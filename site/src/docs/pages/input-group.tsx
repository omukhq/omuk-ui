import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Password from '../examples/input-group/password';
import passwordSource from '../examples/input-group/password.tsx?raw';
import InputGroupPlayground from '../examples/input-group/playground';
import Prefix from '../examples/input-group/prefix';
import prefixSource from '../examples/input-group/prefix.tsx?raw';
import Search from '../examples/input-group/search';
import searchSource from '../examples/input-group/search.tsx?raw';
import Stacked from '../examples/input-group/stacked';
import stackedSource from '../examples/input-group/stacked.tsx?raw';

export default function InputGroupPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The input group and its code follow."
      >
        <InputGroupPlayground />
      </DocSection>
      <DocSection
        title="An icon and a clear button"
        description="The group is the field’s box; the input inside it has none. An addon at the start holds the icon. The clear button shows only while there is text. Type a few letters."
      >
        <Example source={searchSource}>
          <Search />
        </Example>
      </DocSection>
      <DocSection
        title="A prefix"
        description="InputGroupText is muted text in an addon: a scheme, a domain, a unit. A press on the addon puts the focus in the field."
      >
        <Example source={prefixSource}>
          <Prefix />
        </Example>
      </DocSection>
      <DocSection
        title="Show the password"
        description="An icon button in an addon at the end. A press keeps the focus and the caret in the text. aria-pressed tells a screen reader whether the password shows."
      >
        <Example source={passwordSource}>
          <Password />
        </Example>
      </DocSection>
      <DocSection
        title="Several lines"
        description="With stacked, the group grows in height: for an InputGroupTextarea, or an addon above or below the text."
      >
        <Example source={stackedSource}>
          <Stacked />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Each part also takes the props of its element. InputGroupInput and InputGroupTextarea take every prop of an <input> and a <textarea>."
      >
        <PropsTable
          rows={[
            {
              name: 'size',
              type: "'default' | 'lg'",
              default: "'lg'",
              description:
                'InputGroup. The height. Both are 36 now, the same as every field; default keeps its name for callers.',
            },
            {
              name: 'edge',
              type: "'default' | 'thin'",
              default: "'default'",
              description: 'InputGroup. thin gives a 1-wide edge, not 2.',
            },
            {
              name: 'stacked',
              type: 'boolean',
              default: 'false',
              description:
                'InputGroup. Lets the group grow in height, for a textarea or an addon above or below.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description:
                'InputGroup. The disabled look: the hover fill, the border edge, muted text. Disable the input too.',
            },
            {
              name: 'align',
              type: "'inline-start' | 'inline-end' | 'block-start' | 'block-end'",
              default: "'inline-start'",
              description:
                'InputGroupAddon. Where the addon sits: before or after the text, or above or below it (with stacked).',
            },
            {
              name: 'size (button)',
              type: "'default' | 'xs' | 'icon' | 'icon-xs'",
              default: "'default'",
              description:
                'InputGroupButton. A text button keeps its own size; icon and icon-xs are both a 24 square.',
            },
            {
              name: 'variant',
              type: 'Button variant',
              default: "'ghost'",
              description:
                'InputGroupButton. Any Button variant. Ghost has no fill until hover.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'Give an icon button an aria-label that says what it does: “Clear the search”, not “X”.',
            'Only the focused part shows the ring: the field while its text has the focus, the button when the keyboard reaches it.',
            'InputGroup’s disabled prop sets only the look. Set disabled on the input and the buttons as well.',
          ]}
        />
      </DocSection>
    </>
  );
}
