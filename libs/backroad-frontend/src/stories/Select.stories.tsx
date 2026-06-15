import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'backroad-ui';

const SelectField = ({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
}) => {
  const id = `s-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const meta: Meta<typeof SelectField> = {
  title: 'Components/Select',
  component: SelectField,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof SelectField>;

export const Default: Story = {
  args: {
    label: 'Country',
    options: ['India', 'United States', 'Germany', 'Japan'],
    defaultValue: 'India',
  },
};
