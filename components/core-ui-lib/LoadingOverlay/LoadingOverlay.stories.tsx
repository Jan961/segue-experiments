import type { Meta, StoryObj } from '@storybook/react';

import LoadingOverlay from './LoadingOverlay';

const meta: Meta<typeof LoadingOverlay> = {
  component: LoadingOverlay,
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

export const SpinnerVersion: Story = {
  args: {
    spinner: true,
  },
};

export const LoaderVersion: Story = {
  args: {
    spinner: false,
  },
};
