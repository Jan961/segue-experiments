import type { Meta, StoryObj } from '@storybook/react';

import HierarchicalMenu from './HierarchicalMenu';
import { MenuOption } from './types';

const meta: Meta<typeof HierarchicalMenu> = {
  component: HierarchicalMenu,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof HierarchicalMenu>;

const homeIcon = {
  default: { iconName: 'home', stroke: '', fill: '' },
  active: { iconName: 'home', stroke: '', fill: '' },
};
const bookingsIcon = {
  default: { iconName: 'bookings', stroke: '', fill: '' },
  active: { iconName: 'bookings', stroke: '', fill: '#EC6255' },
};
const marketingIcon = {
  default: { iconName: 'marketing', stroke: '', fill: '#21345B' },
  active: { iconName: 'marketing', stroke: '#41A29A', fill: '#21345B' },
};

const values: MenuOption[] = [
  { label: 'Home', value: '/home', icon: homeIcon },
  {
    label: 'Bookings',
    value: '/bookings',
    icon: bookingsIcon,
    options: [{ label: 'Manage Shows/Productions', value: '/bookings/shows-productions' }],
  },
  {
    label: 'Marketing',
    value: '/marketing',
    icon: marketingIcon,
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
      <div className="w-[800px] h-vh bg-primary-dark-blue text-primary-white p-8">
        <HierarchicalMenu options={values} />
      </div>
    );
  },
};
