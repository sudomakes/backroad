import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { Message, MessageAvatar, MessageContent } from 'backroad-ui';

const LoadingSpinner = backroadClientComponents.loading_spinner;
import { Bot, User } from 'lucide-react';

const themes = [
  'default',
  'claude',
  'twitter',
  'supabase',
  'amethyst-haze',
] as const;
type Theme = (typeof themes)[number];

const ChatMessage = ({
  from,
  text,
  loading,
  loadingVariant,
  theme,
}: {
  from: 'user' | 'assistant';
  text: string;
  loading?: boolean;
  loadingVariant?: 'dots' | 'bars';
  theme?: Theme;
}) => (
  <div
    data-theme={theme ?? 'default'}
    className="w-[32rem] rounded-3xl border border-border bg-background p-6 text-foreground shadow-sm"
  >
    <div className="flex items-start gap-3">
      <Message from={from} className="flex-1">
        <MessageContent>
          <div className="space-y-2">
            <p>{text}</p>
            {loading && (
              <LoadingSpinner
                path="story"
                id="story"
                type="loading_spinner"
                value={null}
                args={{
                  fontSize: 12,
                  top: 0,
                  left: 0,
                  variant: loadingVariant ?? 'dots',
                }}
              />
            )}
          </div>
        </MessageContent>
        <MessageAvatar name={from}>
          {from === 'user' ? (
            <User className="size-4" />
          ) : (
            <Bot className="size-4" />
          )}
        </MessageAvatar>
      </Message>
    </div>
  </div>
);

const meta: Meta<typeof ChatMessage> = {
  title: 'AI Elements/Chat Message',
  component: ChatMessage,
  parameters: { layout: 'centered' },
  argTypes: {
    theme: {
      control: 'select',
      options: themes,
    },
    loadingVariant: {
      control: 'select',
      options: ['dots', 'bars'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ChatMessage>;

export const Assistant: Story = {
  args: {
    from: 'assistant',
    text: 'Hi, how can I help you today?',
    theme: 'default',
  },
};

export const Human: Story = {
  args: {
    from: 'user',
    text: 'Summarise the latest deployment for me.',
    theme: 'default',
  },
};

export const LoadingDots: Story = {
  args: {
    from: 'assistant',
    text: 'Pulling the latest results…',
    loading: true,
    loadingVariant: 'dots',
    theme: 'claude',
  },
};

export const LoadingBars: Story = {
  args: {
    from: 'assistant',
    text: 'Generating response…',
    loading: true,
    loadingVariant: 'bars',
    theme: 'claude',
  },
};

export const UserLoading: Story = {
  args: {
    from: 'user',
    text: 'Sending message…',
    loading: true,
    loadingVariant: 'dots',
    theme: 'default',
  },
};

const themeStories = themes.flatMap((theme) => [
  {
    name: `Assistant${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
    args: { from: 'assistant' as const, text: 'Theme variant preview', theme },
  },
  {
    name: `Human${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
    args: { from: 'user' as const, text: 'Theme variant preview', theme },
  },
  {
    name: `LoadingDots${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
    args: {
      from: 'assistant' as const,
      text: 'Loading with dots…',
      loading: true,
      loadingVariant: 'dots' as const,
      theme,
    },
  },
  {
    name: `LoadingBars${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
    args: {
      from: 'assistant' as const,
      text: 'Loading with bars…',
      loading: true,
      loadingVariant: 'bars' as const,
      theme,
    },
  },
]);

themeStories.forEach(({ name, args }) => {
  (ChatMessage as any)[name] = { args };
});

export const AllThemes: Story = {
  render: () => (
    <div style={{ padding: '2rem' }} className="space-y-8">
      {/* Every theme is rendered in BOTH light and dark so each mode's contrast
          is independently scanned — otherwise a broken mode rots unnoticed. */}
      {themes.flatMap((theme) =>
        (['light', 'dark'] as const).map((mode) => (
          <div
            key={`${theme}-${mode}`}
            data-theme={theme}
            className={`space-y-4 rounded-lg bg-background p-4 text-foreground${
              mode === 'dark' ? ' dark' : ''
            }`}
          >
            <h4 className="text-sm font-medium text-foreground">
              {theme} ({mode})
            </h4>
            {/* No `theme` prop: the messages inherit the swatch's theme context
                so bubble + text resolve from one coherent palette. */}
            <div className="space-y-3">
              <ChatMessage from="assistant" text="Assistant message" />
              <ChatMessage from="user" text="User message" />
              <ChatMessage
                from="assistant"
                text="Loading with dots…"
                loading
                loadingVariant="dots"
              />
              <ChatMessage
                from="assistant"
                text="Loading with bars…"
                loading
                loadingVariant="bars"
              />
            </div>
          </div>
        ))
      )}
    </div>
  ),
};
