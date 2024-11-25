import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';
import { useState } from 'react';

export default {
  component: Checkbox,
} as Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

const Template = () => {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  // return a modal with a placeholder image
  return (
    <div className="p-4">
      <Checkbox id="id" onChange={handleCheck} checked={isChecked} />
    </div>
  );
};
export const Default: Story = Template.bind({});
