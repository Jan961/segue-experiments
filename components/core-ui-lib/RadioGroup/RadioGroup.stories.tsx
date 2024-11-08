import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RadioGroup, { Direction, RadioGroupProps } from './RadioGroup';

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  argTypes: {
    direction: {
      control: {
        type: 'radio',
        options: ['vertical', 'horizontal'],
      },
    },
  },
} as Meta<typeof RadioGroup>;

type Story = StoryObj<typeof RadioGroup>;

const Template = (args: RadioGroupProps) => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div className="p-4">
      <RadioGroup {...args} onChange={handleRadioChange} />
      <p className="mt-4">Selected Value: {selectedValue}</p>
    </div>
  );
};

export const Vertical: Story = Template.bind({});
Vertical.args = {
  options: [
    { text: 'Option 1', value: '1' },
    { text: 'Option 2', value: '2' },
    { text: 'Option 3', value: '3' },
  ],
  direction: Direction.VERTICAL,
};

export const Horizontal: Story = Template.bind({});
Horizontal.args = {
  options: [
    { text: 'Option 1', value: '1' },
    { text: 'Option 2', value: '2' },
    { text: 'Option 3', value: '3' },
  ],
  direction: Direction.HORIZONTAL,
};
