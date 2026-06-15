import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'backroad-ui';

// Renders the real shadcn Tabs (Radix under the hood) shipped by
// backroad-components, mirroring the tabs container renderer.
const TabsDemo = ({ labels }: { labels: string[] }) => (
  <div className="w-96">
    <Tabs defaultValue="0" className="w-full">
      <TabsList className="w-full">
        {labels.map((label, idx) => (
          <TabsTrigger key={label} value={String(idx)}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {labels.map((label, idx) => (
        <TabsContent key={label} value={String(idx)} className="mt-4 p-4">
          <p>Content for {label}.</p>
        </TabsContent>
      ))}
    </Tabs>
  </div>
);

const meta: Meta<typeof TabsDemo> = {
  title: 'Containers/Tabs',
  component: TabsDemo,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof TabsDemo>;

export const ThreeTabs: Story = {
  args: { labels: ['Overview', 'Details', 'Settings'] },
};
