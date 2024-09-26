import type { Meta, StoryObj } from '@storybook/react';

import Select from './Select';

const meta: Meta<typeof Select> = {
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

const values = [
  { text: 'MTM223 Menopause the Musical 2', value: 'MTM223' },
  { text: 'FTMI24 Friends the Musical Parody', value: 'FTMI24' },
  { text: 'TCT24 The Celtic Tenors', value: 'TCT24' },
];

export const Primary: Story = {
  args: {
    label: 'Production',
    placeholder: 'Please select...',
    options: values,
    disabled: false,
    className: 'w-128',
  },
};

export const disabledTransparent: Story = {
  args: {
    label: 'Production',
    placeholder: 'Please select...',
    options: values,
    disabled: true,
    variant: 'transparent',
    className: 'w-128',
  },
};

export const disabledNormal: Story = {
  args: {
    label: 'Production',
    placeholder: 'Please select...',
    options: values,
    disabled: true,
    className: 'w-128',
  },
};

export const error: Story = {
  args: {
    label: 'Production',
    placeholder: 'Please select...',
    options: values,
    disabled: true,
    className: 'w-128',
    error: true,
  },
};
