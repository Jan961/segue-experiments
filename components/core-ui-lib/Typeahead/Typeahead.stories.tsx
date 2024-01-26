import type { Meta, StoryObj } from '@storybook/react';

import Typeahead from './Typeahead';

const meta: Meta<typeof Typeahead> = {
  component: Typeahead,
};

export default meta;
type Story = StoryObj<typeof Typeahead>;

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
