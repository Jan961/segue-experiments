import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment, ReactElement } from 'react';

interface TabsProps {
  tabs: string[];
  selectedTabClass?: string;
  children: ReactElement[];
  onChange?: (i: number) => void;
}

const defaulTabClass =
  'h-comp-height w-fit px-3 bg-white text-primary-input-text text-sm border border-primary-input-text flex justify-center items-center rounded-sm shadow-sm-shadow';
const defaultSelectedTabClass = '!bg-primary-navy !text-white';

export default function Tabs({ tabs = [], selectedTabClass = '', children, onChange }: TabsProps) {
  return (
    <div>
      <Tab.Group onChange={onChange}>
        <Tab.List className="flex items-center">
          {tabs?.map((t) => (
            <Tab key={t} as={Fragment}>
              {({ selected }) => {
                return (
                  <button
                    className={classNames(
                      defaulTabClass,
                      selected ? `${selectedTabClass || defaultSelectedTabClass}` : '',
                    )}
                  >
                    {t}
                  </button>
                );
              }}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 min-h-24 h-full w-full border border-primary-navy">{children}</Tab.Panels>
      </Tab.Group>
    </div>
  );
}
