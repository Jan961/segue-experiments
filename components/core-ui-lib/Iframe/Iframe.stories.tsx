import type { Meta, StoryObj } from '@storybook/react';

import Iframe from './Iframe';

const meta: Meta<typeof Iframe> = {
  component: Iframe,
};

export default meta;
type Story = StoryObj<typeof Iframe>;

export const Small: Story = {
  args: {
    src: 'http://seguetheatre.com/',
    variant: 'sm',
    className: '',
  },
};

export const Medium: Story = {
  args: {
    src: 'http://seguetheatre.com/',
    variant: 'md',
    className: '',
  },
};

export const Large: Story = {
  args: {
    src: 'http://seguetheatre.com/',
    variant: 'lg',
    className: '',
  },
};
