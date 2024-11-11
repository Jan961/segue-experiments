import type { Meta, StoryObj } from '@storybook/react';

import PopupModal from './PopupModal';

const meta: Meta<typeof PopupModal> = {
  component: PopupModal,
};

export default meta;
type Story = StoryObj<typeof PopupModal>;

export const Primary: Story = {
  args: {
    title: 'Add booking',
    titleClass: 'text-primary-navy',
    show: true,
  },
};
