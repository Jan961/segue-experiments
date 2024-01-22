import type { Meta, StoryObj } from '@storybook/react';

import Icon from './Icon';

const meta: Meta<typeof Icon> = {
  component: Icon,
  argTypes: {
    variant: { control: 'radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Icons: Story = {
  render: (args) => {
    return (
      <div className="flex w-full items-center gap-4 p-4">
        <Icon iconName="search" {...args} />
        <Icon iconName="chevron-down" {...args} />
        <Icon iconName="check" {...args} />
        <Icon iconName="minus" {...args} />
        <Icon iconName="edit" {...args} />
        <Icon iconName="delete" {...args} />
        <Icon iconName="calendar" {...args} />
        <Icon iconName="spin" {...args} />
        <Icon iconName="pin-open" {...args} />
        <Icon iconName="pin-close" {...args} />
        <Icon iconName="note" {...args} />
        <Icon iconName="note-filled" {...args} />
      </div>
    );
  },
};
