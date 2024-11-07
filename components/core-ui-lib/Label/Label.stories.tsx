import type { Meta, StoryObj } from '@storybook/react';
import Label from './Label';

export default {
  component: Label,
} as Meta<typeof Label>;

type Story = StoryObj<typeof Label>;

export const xs: Story = {
  args: {
    variant: 'xs',
  },
};

export const sm: Story = {
  args: {
    variant: 'sm',
  },
};

export const md: Story = {
  args: {
    variant: 'md',
  },
};

export const lg: Story = {
  args: {
    variant: 'lg',
  },
};
