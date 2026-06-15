import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Switch } from 'backroad-ui';

const ToggleField = ({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) => {
  const id = `tg-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="flex items-center gap-3">
      <Switch id={id} defaultChecked={defaultChecked} />
      <Label htmlFor={id} className="flex-1 font-normal">
        {label}
      </Label>
    </div>
  );
};

const meta: Meta<typeof ToggleField> = {
  title: 'Components/Toggle',
  component: ToggleField,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof ToggleField>;

export const Off: Story = { args: { label: 'Notifications' } };
export const On: Story = { args: { label: 'Dark mode', defaultChecked: true } };
