import type { Meta, StoryObj } from '@storybook/react';

import Select from './Select';

const meta: Meta<typeof Select> = {
  component: Select,
  argTypes: {
    disabled: { control: { type: 'boolean' } },
  },
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
    options: values,
    disabled: false,
    className: 'w-96',
    label: 'Some label',
    placeHolder: 'Please select a value...',
  },
};
