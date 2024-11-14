import type { Meta, StoryObj } from '@storybook/react';

import FormError from './FormError';

const meta: Meta<typeof FormError> = {
  component: FormError,
};

export default meta;
type Story = StoryObj<typeof FormError>;

export const Default: Story = {
  args: {
    error: 'This is an error',
    variant: 'md',
  },
};
