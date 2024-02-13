import type { Meta, StoryObj } from '@storybook/react';

import ConfirmationDialoig from './ConfirmationDialog';

const meta: Meta<typeof ConfirmationDialoig> = {
  component: ConfirmationDialoig,
};

export default meta;
type Story = StoryObj<typeof ConfirmationDialoig>;

export const GlobalModal1a: Story = {
  args: {
    variant: 'close',
    show: true
  },
};

export const GlobalModal2a: Story = {
    args: {
      variant: 'cancel',
      show: true
    },
  };

  export const GlobalModal3: Story = {
    args: {
      variant: 'delete',
      show: true
    },
  };
  
  export const GlobalModal4: Story = {
    args: {
      variant: 'logout',
      show: true
    },
  };
  

  export const GlobalModal5: Story = {
    args: {
      variant: 'leave',
      show: true
    },
  };
  