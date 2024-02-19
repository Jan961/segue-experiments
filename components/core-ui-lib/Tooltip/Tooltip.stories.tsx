import type { Meta, StoryObj } from '@storybook/react';

import Tooltip from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Test: Story = {
  args: {
    show: true,
    title: 'Test',
    position: 'right',
    body: 'Some Text test for the tooltip'
  },
};
