import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatInput } from 'backroad-components';

const themes = [
  'default',
  'claude',
  'twitter',
  'supabase',
  'amethyst-haze',
] as const;
type Theme = (typeof themes)[number];

const ChatInputDemo = ({
  placeholder,
  value,
  disabled,
  theme,
}: {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  theme?: Theme;
}) => (
  <div data-theme={theme ?? 'default'} className="w-[32rem]">
    <ChatInput
      path="story"
      id="story"
      type="chat_input"
      value={value ?? null}
      args={{ placeholder: placeholder ?? 'Send a message…' }}
    />
  </div>
);

const meta: Meta<typeof ChatInputDemo> = {
  title: 'Components/ChatInput',
  component: ChatInputDemo,
  parameters: { layout: 'centered' },
  argTypes: {
    theme: {
      control: 'select',
      options: themes,
    },
  },
};
export default meta;
type Story = StoryObj<typeof ChatInputDemo>;

export const Default: Story = {
  args: { placeholder: 'Send a message…' },
};

export const Filled: Story = {
  args: { placeholder: 'Ask Backroad anything…', value: 'Hello, how are you?' },
};

export const Disabled: Story = {
  args: { placeholder: 'Chat is disabled', disabled: true },
};

export const LongPlaceholder: Story = {
  args: {
    placeholder:
      'Type your question here, press Enter to send, Shift+Enter for new line…',
  },
};

themes.forEach((theme) => {
  (ChatInputDemo as any)[`${theme.charAt(0).toUpperCase() + theme.slice(1)}`] =
    {
      args: { placeholder: `Theme: ${theme}`, theme },
    };
  (ChatInputDemo as any)[
    `${theme.charAt(0).toUpperCase() + theme.slice(1)}Filled`
  ] = {
    args: { placeholder: `Theme: ${theme}`, value: 'Sample message', theme },
  };
  (ChatInputDemo as any)[
    `${theme.charAt(0).toUpperCase() + theme.slice(1)}Dark`
  ] = {
    args: { placeholder: `Theme: ${theme} (dark)`, theme },
    render: (args_: typeof Default.args) => (
      <div className="dark">
        <ChatInputDemo {...args_} />
      </div>
    ),
  };
});

export const AllThemes: Story = {
  render: () => (
    <div style={{ padding: '2rem' }} className="space-y-8">
      {themes.map((theme) => (
        <div key={theme} data-theme={theme} className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            {theme} (light)
          </h4>
          <ChatInputDemo
            placeholder={`Send a message (${theme})…`}
            theme={theme}
          />
          <ChatInputDemo
            placeholder={`Filled (${theme})`}
            value="Sample message"
            theme={theme}
          />
        </div>
      ))}
      {themes.map((theme) => (
        <div
          key={`${theme}-dark`}
          data-theme={theme}
          className="dark space-y-4"
        >
          <h4 className="text-sm font-medium text-muted-foreground">
            {theme} (dark)
          </h4>
          <ChatInputDemo
            placeholder={`Send a message (${theme} dark)…`}
            theme={theme}
          />
          <ChatInputDemo
            placeholder={`Filled (${theme} dark)`}
            value="Sample message"
            theme={theme}
          />
        </div>
      ))}
    </div>
  ),
};
