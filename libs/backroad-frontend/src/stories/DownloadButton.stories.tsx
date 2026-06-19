import type { Meta, StoryObj } from '@storybook/react-vite';
import { backroadClientComponents } from 'backroad-components';
import { ThemeMatrix } from './theme-matrix';

// The real `download_button` renderer the backroad tree mounts (wraps the
// shadcn Button and triggers a client-side blob download on click). Rendering
// it directly keeps the story in lockstep with what the app actually ships.
const DownloadButton = backroadClientComponents.download_button;
// The payload (data/filename/mime) lives server-side and is fetched on click,
// so the rendered node only carries the label.
const downloadButton = (label: string) => ({
  path: 'story',
  id: 'story',
  type: 'download_button' as const,
  value: false,
  args: { label },
});

const meta: Meta<typeof DownloadButton> = {
  title: 'Components/DownloadButton',
  component: DownloadButton,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof DownloadButton>;

export const Default: Story = {
  render: () => <DownloadButton {...downloadButton('Download')} />,
};
export const LongLabel: Story = {
  render: () => (
    <DownloadButton
      {...downloadButton('Download the full report as a text file')}
    />
  ),
};
export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <DownloadButton {...downloadButton('Download')} />
    </ThemeMatrix>
  ),
};
