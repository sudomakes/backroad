import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Label } from 'backroad-ui';

const CheckboxField = ({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) => {
  const id = `cb-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="flex items-center gap-3">
      <Checkbox id={id} defaultChecked={defaultChecked} />
      <Label htmlFor={id} className="flex-1 font-normal">
        {label}
      </Label>
    </div>
  );
};

const meta: Meta<typeof CheckboxField> = {
  title: 'Components/Checkbox',
  component: CheckboxField,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof CheckboxField>;

export const Unchecked: Story = { args: { label: 'Accept terms' } };
export const Checked: Story = {
  args: { label: 'Email me updates', defaultChecked: true },
};
