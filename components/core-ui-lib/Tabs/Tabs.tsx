import { Tab } from '@headlessui/react';
import { Fragment, ReactElement } from 'react';
import TabButton from '../TabButton';

interface TabsProps {
  tabs: string[];
  selectedTabClass?: string;
  children: ReactElement[];
  onChange?: (index: number) => void;
  disabled?: boolean;
  defaultIndex?: number;
}

export default function Tabs({
  tabs = [],
  selectedTabClass = '',
  children,
  onChange,
  disabled = false,
  defaultIndex = 0,
}: TabsProps) {
  return (
    <div>
      <Tab.Group defaultIndex={defaultIndex} onChange={onChange}>
        <Tab.List className="flex items-center mb-5 -mt-5">
          {tabs.map((tabLabel, index) => (
            <Tab key={tabLabel} as={Fragment}>
              {({ selected }) => (
                <TabButton
                  text={tabLabel}
                  className={`w-[155px] ${selected && !disabled ? selectedTabClass : ''}`}
                  disabled={disabled}
                  variant="secondary"
                  onClick={() => onChange?.(index)}
                />
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>{children}</Tab.Panels>
      </Tab.Group>
    </div>
  );
}
