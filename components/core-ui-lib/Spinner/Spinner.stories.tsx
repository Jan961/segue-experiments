import type { Meta, StoryFn } from '@storybook/react';
import Spinner from './Spinner';

export default {
  component: Spinner,
  argTypes: {
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
    className: { control: 'text' },
  },
} as Meta<typeof Spinner>;

// Template
const Template: StoryFn<typeof Spinner> = (args) => <Spinner {...args} />;

// Default Spinner
export const Default = Template.bind({});
Default.args = {
  size: 'md',
  className: '',
};

// Small Spinner
export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  className: '',
};

// Large Spinner
export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  className: '',
};

// Spinner with Custom Class
export const CustomClass = Template.bind({});
CustomClass.args = {
  size: 'md',
  className: 'bg-red-500',
};
