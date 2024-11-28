import type { Meta, StoryObj } from '@storybook/react';

import DateRange from './DateRange';
import { newDate } from 'services/dateService';

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
    value: { from: newDate(), to: newDate() },
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    className: 'w-fit',
    label: 'Date',
    onChange: () => null,
    value: { from: newDate(), to: newDate() },
    disabled: true,
  },
};
