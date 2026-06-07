import type { Meta, StoryObj } from '@storybook/react-vite';

const Stats = ({
  items,
}: {
  items: Array<{ title: string; value: string; description?: string }>;
}) => (
  <div className="stats shadow">
    {items.map((s) => (
      <div className="stat" key={s.title}>
        <div className="stat-title">{s.title}</div>
        <div className="stat-value">{s.value}</div>
        {s.description && <div className="stat-desc">{s.description}</div>}
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
      { title: 'Downloads', value: '31K', description: 'Jan 1st - Feb 1st' },
      { title: 'New users', value: '4,200', description: '↗︎ 400 (22%)' },
      { title: 'New registers', value: '1,200', description: '↘︎ 90 (14%)' },
    ],
  },
};
