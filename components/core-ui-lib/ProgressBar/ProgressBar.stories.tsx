import ProgressBar from './ProgressBar';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const ZeroProgress: Story = {
  render: () => <ProgressBar progress={0} className="!w-[200px] h-4" />,
};

export const SixtyProgress: Story = {
  render: (args) => <ProgressBar progress={60} className="!w-[200px] h-4" {...args} />,
};

export const HundredProgress: Story = {
  render: () => <ProgressBar progress={100} className="!w-[200px] h-4" />,
};
