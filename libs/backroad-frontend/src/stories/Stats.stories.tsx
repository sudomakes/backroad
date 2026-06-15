import type { Meta, StoryObj } from '@storybook/react-vite';

// Mirrors libs/backroad-components/src/lib/components/stats.tsx — the
// token-driven, daisyUI-free stats card.
const Stats = ({
  items,
}: {
  items: Array<{ label: string; value: string; description?: string }>;
}) => (
  <div className="flex min-h-[100px] flex-wrap divide-x divide-border rounded-lg border border-border bg-card text-card-foreground shadow-sm">
    {items.map((s) => (
      <div className="flex flex-col gap-1 px-6 py-4" key={s.label}>
        <div className="text-sm text-muted-foreground">{s.label}</div>
        <div className="text-2xl font-semibold text-primary">{s.value}</div>
        {s.description && (
          <div className="mt-2 text-sm text-muted-foreground">
            {s.description}
          </div>
        )}
      </div>
    ))}
  </div>
);

const meta: Meta<typeof Stats> = {
  title: 'Components/Stats',
  component: Stats,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Stats>;

export const Triple: Story = {
  args: {
    items: [
      { label: 'Downloads', value: '31K', description: 'Jan 1st - Feb 1st' },
      { label: 'New users', value: '4,200', description: '↗︎ 400 (22%)' },
      { label: 'New registers', value: '1,200', description: '↘︎ 90 (14%)' },
    ],
  },
};
