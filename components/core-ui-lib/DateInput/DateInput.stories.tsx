import type { Meta, StoryObj } from '@storybook/react';

import DateInput from './DateInput';

const meta: Meta<typeof DateInput> = {
  component: DateInput,
};

export default meta;
type Story = StoryObj<typeof DateInput>;

export const Primary: Story = {
  args: {},
};

export const DateInputLabel: Story = {
  args: {
    label: 'Date',
  },
};
