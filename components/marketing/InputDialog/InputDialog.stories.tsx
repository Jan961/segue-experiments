import type { Meta, StoryObj } from '@storybook/react';

import InputDialog from './InputDialog';

const meta: Meta<typeof InputDialog> = {
  component: InputDialog,
};

export default meta;
type Story = StoryObj<typeof InputDialog>;

export const Sample: Story = {
  args: {
    show: true,
    titleText: 'Sample Input Dialog',
    subTitleText: 'Optional Sub Title',
    onCancelClick: () => alert("You've pressed cancel"),
    onSaveClick: () => alert("You've pressed save"),
    cancelText: 'Cancel',
    saveText: 'Save and Close',
    inputPlaceholder: 'Sample input text box',
    inputLabel: 'Sample Input',
    inputValue: 'Test test',
  },
};
