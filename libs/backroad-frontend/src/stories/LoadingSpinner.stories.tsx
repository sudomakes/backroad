import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSpinner } from 'backroad-components';

const ThemeFrame = ({
  theme,
  dark,
  children,
}: {
  theme: string;
  dark?: boolean;
  children: React.ReactNode;
}) => (
  <div
    data-theme={theme}
    className={dark ? 'dark' : undefined}
    style={{ padding: '2rem' }}
  >
    <div className="flex items-center justify-center rounded-2xl border border-border bg-background p-6 text-foreground shadow-sm">
      {children}
    </div>
  </div>
);

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

const createStory = (
  variant: 'dots' | 'bars',
  theme: string,
  dark?: boolean
) => ({
  render: () => (
    <ThemeFrame theme={theme} dark={dark}>
      <LoadingSpinner
        path="story"
        id="story"
        type="loading_spinner"
        value={null}
        args={{ fontSize: 14, top: 0, left: 0, variant }}
      />
    </ThemeFrame>
  ),
});

export const DotsDefault: Story = createStory('dots', 'default', true);
export const DotsClaude: Story = createStory('dots', 'claude');
export const DotsTwitter: Story = createStory('dots', 'twitter');
export const DotsSupabase: Story = createStory('dots', 'supabase');
export const DotsAmethystHaze: Story = createStory('dots', 'amethyst-haze');

export const BarsDefault: Story = createStory('bars', 'default', true);
export const BarsClaude: Story = createStory('bars', 'claude');
export const BarsTwitter: Story = createStory('bars', 'twitter');
export const BarsSupabase: Story = createStory('bars', 'supabase');
export const BarsAmethystHaze: Story = createStory('bars', 'amethyst-haze');

export const AllVariants: Story = {
  render: () => (
    <div style={{ padding: '2rem' }} className="space-y-8">
      {['default', 'claude', 'twitter', 'supabase', 'amethyst-haze'].map(
        (theme) => (
          <div key={theme} data-theme={theme} className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              {theme}
            </h4>
            <div className="flex items-center gap-4">
              <LoadingSpinner
                path="story"
                id="dots"
                type="loading_spinner"
                value={null}
                args={{ fontSize: 14, top: 0, left: 0, variant: 'dots' }}
              />
              <LoadingSpinner
                path="story"
                id="bars"
                type="loading_spinner"
                value={null}
                args={{ fontSize: 14, top: 0, left: 0, variant: 'bars' }}
              />
            </div>
          </div>
        )
      )}
    </div>
  ),
};
