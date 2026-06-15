import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `text_area` renderer (shadcn Textarea + Label, commits on blur).
const TextArea = backroadClientComponents.text_area;
const textArea = (
  args: { label: string; placeholder?: string; rows?: number },
  value = ''
) => ({ path: 'story', id: 'story', type: 'text_area' as const, value, args });

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof TextArea>;

export const Empty: Story = {
  render: () => (
    <TextArea
      {...textArea({ label: 'Feedback', placeholder: 'Tell us what you think…' })}
    />
  ),
};
export const WithValue: Story = {
  render: () => (
    <TextArea
      {...textArea(
        { label: 'Notes', rows: 6 },
        'Multi-line\ncontent stays\nas typed.'
      )}
    />
  ),
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <TextArea
        {...textArea({ label: 'Feedback', placeholder: 'Tell us what you think…' })}
      />
    </ThemeMatrix>
  ),
};
