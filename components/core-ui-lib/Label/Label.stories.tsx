import type { Meta, StoryObj } from '@storybook/react';
import Label from './Label';

export default {
  component: Label,
} as Meta<typeof Label>;

type Story = StoryObj<typeof Label>;

export const xs: Story = {
  args: {
    text: 'Label extra small',
    variant: 'xs',
  },
};

export const sm: Story = {
  args: {
    text: 'Label small',
    variant: 'sm',
  },
};

export const md: Story = {
  args: {
    text: 'Label medium',
    variant: 'md',
  },
};

export const lg: Story = {
  args: {
    text: 'Label large',
    variant: 'lg',
  },
};
