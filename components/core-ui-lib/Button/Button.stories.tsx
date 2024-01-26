import type { Meta, StoryObj } from '@storybook/react';

import Button from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    text: 'Primary Button',
    disabled: false,
    className: 'w-36',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Cancel',
    disabled: false,
    variant: 'secondary',
    className: 'w-36',
  },
};

export const Tertiary: Story = {
  args: {
    text: 'Delete',
    disabled: false,
    variant: 'tertiary',
    className: 'w-36',
  },
};

export const PrefixIcon: Story = {
  args: {
    text: 'Primary Button',
    disabled: false,
    className: 'w-36',
    prefixIconName: 'edit',
    iconProps:{
      stroke:"#ffffff"
    }
  },
};

export const SuffixIcon: Story = {
  args: {
    text: 'Primary Button',
    disabled: false,
    className: 'w-36',
    sufixIconName: 'edit',
    iconProps:{
      stroke:"#ffffff"
    }
  },
};
