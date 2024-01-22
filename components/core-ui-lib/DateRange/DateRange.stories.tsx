import type { Meta, StoryObj } from '@storybook/react';

import DateRange from './DateRange';

const meta: Meta<typeof DateRange> = {
  component: DateRange,
};

export default meta;
type Story = StoryObj<typeof DateRange>;

export const Primary: Story = {
  args: {
    disabled: false,
    label: 'Date',
  },
};
