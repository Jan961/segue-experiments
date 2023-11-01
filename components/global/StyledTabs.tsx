import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { PropsWithChildren, Fragment } from 'react';

export const StyledTab = ({ children }: PropsWithChildren<unknown>) => {
  const commonClass = 'p-2 px-4 rounded-t-lg border border-b-2 bg-white ';

  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <button
          className={
            selected
              ? classNames('text-primary-green border-primary-green font-bold', commonClass)
              : classNames('', commonClass)
          }
        >
          {children}
        </button>
      )}
    </Tab>
  );
};
