import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';

const Markdown = backroadClientComponents.markdown;

const themes = [
  'default',
  'claude',
  'twitter',
  'supabase',
  'amethyst-haze',
] as const;
type Theme = (typeof themes)[number];

const SAMPLE = `# Markdown

Prose pairs with a themed code panel. Inline \`code\` is a chip, and fenced
blocks track the active palette + mode instead of a fixed dark slate.

\`\`\`sh
echo hi
\`\`\`

\`\`\`
some output
\`\`\`
`;

// A single very long line inside a fenced block + a wide inline JSON blob —
// the kind of content that, without `overflow-x-auto` on <pre>, would blow out
// its container instead of scrolling internally.
const LONG_CODE = `# Long code overflow

A fenced block with one very long line should scroll horizontally **inside**
the panel — it must not stretch the card (or, in a columns layout, the column).

\`\`\`sh
cat /etc/os-release 2>/dev/null || uname -a && echo "PRETTY_NAME=Ubuntu plucky; VERSION_CODENAME=plucky; LOGO=ubuntu-logo; details={command: 'cat /etc/os-release', exitCode: 0, durationMs: 272}"
\`\`\`

\`\`\`
{"id":"backroad-6e6e5c00-aea2-4028-a5d9-41324bd60da6","tool":"bash","args":{"command":"cat /etc/os-release 2>/dev/null || uname -a"},"result":{"stdout":"PRETTY_NAME=\\"Ubuntu plucky\\"\\nVERSION_CODENAME=plucky\\nLOGO=ubuntu-logo","details":{"command":"cat /etc/os-release 2>/dev/null || uname -a","exitCode":0}}}
\`\`\`
`;

const MarkdownCard = ({
  theme,
  body,
  width = 'w-[32rem]',
}: {
  theme?: Theme;
  body: string;
  width?: string;
}) => (
  <div
    data-theme={theme ?? 'default'}
    className={`${width} rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm`}
  >
    <Markdown
      path="story"
      id="story"
      type="markdown"
      value={null}
      args={{ body }}
    />
  </div>
);

const meta: Meta<typeof MarkdownCard> = {
  title: 'AI Elements/Markdown',
  component: MarkdownCard,
  parameters: { layout: 'centered' },
  argTypes: {
    theme: { control: 'select', options: themes },
  },
};
export default meta;
type Story = StoryObj<typeof MarkdownCard>;

export const Default: Story = {
  args: { theme: 'default', body: SAMPLE },
};

export const Claude: Story = {
  args: { theme: 'claude', body: SAMPLE },
};

// Long code lines scroll horizontally inside the panel instead of widening
// the card. Rendered in a deliberately narrow container to make the internal
// scrollbar obvious.
export const LongCode: Story = {
  render: () => <MarkdownCard body={LONG_CODE} width="w-[24rem]" />,
};

// The same long-code markdown placed inside a 2-column grid (mirroring the
// `columns` container) — proves one wide column can't disrupt the column
// distribution; it scrolls within its own min-w-0 cell.
export const LongCodeInColumns: Story = {
  render: () => (
    <div className="grid w-[40rem] grid-cols-2 gap-4">
      <div className="min-w-0">
        <MarkdownCard body={LONG_CODE} width="w-full" />
      </div>
      <div className="min-w-0">
        <MarkdownCard body={SAMPLE} width="w-full" />
      </div>
    </div>
  ),
};

export const AllThemes: Story = {
  render: () => (
    <div style={{ padding: '2rem' }} className="space-y-8">
      {/* Every theme is rendered in BOTH light and dark so each mode's code
          panel contrast is independently scanned — a code block that goes dark
          in light mode (the bug this fixes) is caught here. */}
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
            <MarkdownCard body={SAMPLE} />
          </div>
        ))
      )}
    </div>
  ),
};
