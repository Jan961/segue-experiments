import type { Meta, StoryObj } from '@storybook/react';

import ConfirmationDialoig from './ConfirmationDialog';

const meta: Meta<typeof ConfirmationDialoig> = {
  component: ConfirmationDialoig,
};

export default meta;
type Story = StoryObj<typeof ConfirmationDialoig>;

export const GlobalModal1a: Story = {
  args: {
    yesBtnClass: 'primary-blue',
    noBtnClass: 'primary-red',
    question: 'Are you sure you want to close?',
    warning: 'Any unsaved changes may be lost.',
    show: true
  },
};

export const GlobalModal2a: Story = {
    args: {
      yesBtnClass: 'bg-primary-navy',
      noBtnClass: '',
      question: 'Are you sure you want to cancel?',
      warning: 'Any unsaved changes may be lost.',
      show: true
    },
  };

  export const GlobalModal3: Story = {
    args: {
      yesBtnClass: 'bg-primary-navy',
      noBtnClass: 'bg-primary-red',
      question: 'Are you sure you want to delete?',
      warning: 'This action cannot be undone.',
      show: true
    },
  };
  
  export const GlobalModal4: Story = {
    args: {
      yesBtnClass: 'bg-primary-navy',
      noBtnClass: '',
      question: 'Are you sure you want to log out?',
      warning: '',
      show: true
    },
  };
  

  export const GlobalModal5: Story = {
    args: {
      yesBtnClass: 'bg-primary-navy',
      noBtnClass: '',
      question: 'Are you sure you want to leave this page?',
      warning: 'Any unsaved changes may be lost.',
      show: true
    },
  };
  