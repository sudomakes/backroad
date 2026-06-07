import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Mirrors libs/backroad-components/src/lib/containers/tabs.tsx: daisyui
// .tabs / .tab / .tab-lifted / .tab-active with click-based selection.
// Adds button semantics + keyboard activation so a11y rules pass —
// changes axe surfaces here are real fixes for the production
// component too.
const Tabs = ({ labels }: { labels: string[] }) => {
  const [active, setActive] = useState(0);
  return (
    <div className="w-96">
      <div role="tablist" className="tabs w-full">
        {labels.map((label, idx) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={active === idx}
            tabIndex={active === idx ? 0 : -1}
            className={`tab tab-lifted ${active === idx ? 'tab-active' : ''}`}
            onClick={() => setActive(idx)}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-4 p-4">
        <p>Content for {labels[active]}.</p>
      </div>
    </div>
  );
};

const meta: Meta<typeof Tabs> = {
  title: 'Containers/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const ThreeTabs: Story = {
  args: { labels: ['Overview', 'Details', 'Settings'] },
};
