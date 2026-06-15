import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from 'backroad-ui';

// The Vercel AI Elements PromptInput composer as wired by the chat_input
// renderer. `aria-label` gives the textarea an accessible name for axe (the
// production renderer relies on the placeholder + surrounding chat context).
const PromptInputDemo = ({ placeholder }: { placeholder?: string }) => (
  <div className="w-[32rem] rounded-3xl border border-border bg-background p-6 text-foreground shadow-sm">
    <PromptInput onSubmit={(e) => e.preventDefault()}>
      <PromptInputTextarea placeholder={placeholder} aria-label="Message" />
      <PromptInputToolbar>
        <span />
        <PromptInputSubmit />
      </PromptInputToolbar>
    </PromptInput>
  </div>
);

const meta: Meta<typeof PromptInputDemo> = {
  title: 'AI Elements/PromptInput',
  component: PromptInputDemo,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof PromptInputDemo>;

export const Default: Story = {
  args: { placeholder: 'Send a message…' },
};

export const Filled: Story = {
  args: { placeholder: 'Ask Backroad anything…' },
  render: (args) => (
    <div data-theme="claude" className="dark">
      <PromptInputDemo {...args} />
    </div>
  ),
};
