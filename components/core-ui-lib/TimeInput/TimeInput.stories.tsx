import type { Meta, StoryObj } from '@storybook/react';

import TimeInput from './TimeInput';

const meta: Meta<typeof TimeInput> = {
  component: TimeInput,
};

export default meta;
type Story = StoryObj<typeof TimeInput>;

export const Primary: Story = {
  args: {},
};
