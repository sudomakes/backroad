import type { Meta, StoryObj } from '@storybook/react-vite';

const Radio = ({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
}) => {
  const name = `r-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <fieldset className="form-control">
      <legend className="label">
        <span className="backroad-label">{label}</span>
      </legend>
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const id = `${name}-${opt.replace(/\W+/g, '-').toLowerCase()}`;
          return (
            <div key={opt} className="flex gap-3 items-center">
              <input
                id={id}
                type="radio"
                name={name}
                className="radio radio-primary"
                defaultChecked={defaultValue === opt}
              />
              <label htmlFor={id}>{opt}</label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: 'Plan',
    options: ['Free', 'Pro', 'Enterprise'],
    defaultValue: 'Pro',
  },
};
