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

export const Primary: Story = {
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
        <Icon iconName="home" {...args} />
        <Icon iconName="menu" {...args} />
        <Icon iconName="exit" {...args} />
        <Icon iconName="excel" fill="#7B568D" {...args} />
        <Icon iconName="cross" {...args} />
        <Icon iconName="info-circle-solid" {...args} />
        <Icon iconName="show-password" {...args} />
        <Icon iconName="hide-password" {...args} />
      </div>
    );
  },
};

export const MenuIcons: Story = {
  render: (args) => {
    return (
      <>
        <div className="flex w-128 items-center gap-4 p-4 bg-primary-dark-blue">
          <Icon iconName="home" {...args} />
          <Icon iconName="bookings" {...args} />
          <Icon iconName="marketing" fill="#21345B" {...args} />
          <Icon iconName="tasks" fill="#FFF" {...args} />
          <Icon iconName="contracts" fill="#FFF" {...args} />
          <Icon iconName="production-management" {...args} />
          <Icon iconName="system-admin" stroke="#FFF" fill="#FFF" {...args} />
        </div>
        <div className="flex w-128 items-center gap-4 p-4 bg-primary-dark-blue">
          <Icon iconName="home" {...args} />
          <Icon iconName="bookings" fill="#EC6255" {...args} />
          <Icon iconName="marketing" stroke="#41A29A" fill="#21345B" {...args} />
          <Icon iconName="tasks" fill="#FDCE74" {...args} />
          <Icon iconName="contracts" fill="#0093C0" {...args} />
          <Icon iconName="production-management" fill="#7B568D" {...args} />
          <Icon iconName="system-admin" stroke="#E94580" fill="#E94580" {...args} />
        </div>
      </>
    );
  },
};
