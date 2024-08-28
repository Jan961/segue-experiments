import type { Meta, StoryObj } from '@storybook/react';

import DateRange from './DateRange';

const meta: Meta<typeof DateRange> = {
  component: DateRange,
};

export default meta;
type Story = StoryObj<typeof DateRange>;

export const Primary: Story = {
  args: {
    className: 'w-fit',
    label: 'Date',
    onChange: () => null,
    value: { from: new Date(), to: new Date() },
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    className: 'w-fit',
    label: 'Date',
    onChange: () => null,
    value: { from: new Date(), to: new Date() },
    disabled: true,
  },
};
