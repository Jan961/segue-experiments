import type { Meta, StoryObj } from '@storybook/react';

import HierarchicalMenu from './HierarchicalMenu';

const meta: Meta<typeof HierarchicalMenu> = {
  component: HierarchicalMenu,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof HierarchicalMenu>;

const values = [
  { label: 'Home', value: '/home' },
  {
    label: 'Bookings',
    value: '/bookings',
    options: [{ label: 'Manage Shows/Productions', value: '/bookings/shows-productions' }],
  },
  {
    label: 'Marketing',
    value: '/marketing',
    options: [
      {
        label: 'Marketing Home',
        value: '/marketing/home',
        options: [
          { label: 'Sales', value: '/marketing/home/sales' },
          { label: 'Archived Sales', value: '/marketing/home/archived-sales' },
        ],
      },
    ],
  },
];

export const Example: Story = {
  render: () => {
    return (
      <div className="w-[800px] h-vh bg-primary-dark-blue text-primary-white">
        <HierarchicalMenu options={values} />
      </div>
    );
  },
};
