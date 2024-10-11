import type { Meta, StoryObj } from '@storybook/react';

import ConfirmationDialoig from './ConfirmationDialog';

const meta: Meta<typeof ConfirmationDialoig> = {
  component: ConfirmationDialoig,
};

export default meta;
type Story = StoryObj<typeof ConfirmationDialoig>;

export const CloseModal: Story = {
  args: {
    variant: 'close',
    show: true,
  },
};

export const CancelModal: Story = {
  args: {
    variant: 'cancel',
    show: true,
  },
};

export const DeleteModal: Story = {
  args: {
    variant: 'delete',
    show: true,
  },
};

export const LogoutModal: Story = {
  args: {
    variant: 'logout',
    show: true,
  },
};

export const LeavePageModal: Story = {
  args: {
    variant: 'leave',
    show: true,
  },
};

export const ReturnPageModal: Story = {
  args: {
    variant: 'return',
    show: true,
  },
};

export const ContinuePageModal: Story = {
  args: {
    variant: 'continue',
    show: true,
  },
};
