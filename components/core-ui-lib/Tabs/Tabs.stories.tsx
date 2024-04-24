import type { Meta } from '@storybook/react';

import Tabs from './Tabs';
import { Tab } from '@headlessui/react';

const meta: Meta<typeof Tabs> = {
  component: Tabs,
};

const tabs = ['Booking', 'Marketing', 'Reports', 'Tab with a reaaaaaallllyyyy long name'];

export default meta;

export const Primary = () => {
  return (
    <Tabs selectedTabClass="!bg-primary-green/[0.30] !text-primary-navy" tabs={tabs}>
      <Tab.Panel className="w-42 h-24 flex justify-center items-center">First Tab</Tab.Panel>
      <Tab.Panel className="w-42 h-24 flex justify-center items-center">Second Tab</Tab.Panel>
      <Tab.Panel className="w-42 h-24 flex justify-center items-center">Third Tab</Tab.Panel>
      <Tab.Panel className="w-42 h-24 flex justify-center items-center">Fourth Tab</Tab.Panel>
    </Tabs>
  );
};
