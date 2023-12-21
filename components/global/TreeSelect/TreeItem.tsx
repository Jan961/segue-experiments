import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { TreeItemOption, TreeItemSelectedOption } from './types';
import React from 'react';

export interface TreeItemProps {
  value: TreeItemOption;
  onChange: (v: TreeItemSelectedOption) => void;
}

export default function TreeItem({ value, onChange }: TreeItemProps) {
  const { id, name, options } = value;
  const isDisabled = !options || options.length === 0;

  const handleCheckboxToggle = (o, e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...o, parentId: id, checked: e.target.checked });
  };
  return (
    <div className="grid grid-cols-1 bg-white">
      <form className="hidden lg:block">
        <Disclosure as="div" key={id} className="p-2">
          {({ open }) => (
            <>
              <Disclosure.Button
                className="flex w-full items-center bg-white text-sm text-gray-400 hover:text-gray-500"
                disabled={isDisabled}
              >
                <span className="flex items-center">
                  {open ? (
                    <MinusIcon data-testid="tree-item-open" className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <PlusIcon data-testid="tree-item-close" className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
                <span className={`ml-4 ${isDisabled ? 'text-gray-400' : 'text-gray-700'} font-semibold`}>{name}</span>
              </Disclosure.Button>

              <Disclosure.Panel className="ml-9 mt-3">
                <div className="space-y-4">
                  {options.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`filter-${id}-${optionIdx}`}
                        data-testid={`tree-item-checkbox-${option.value}`}
                        name={`${id}[]`}
                        defaultValue={option.value}
                        type="checkbox"
                        checked={option.checked}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={(e) => handleCheckboxToggle(option, e)}
                      />
                      <label htmlFor={`filter-${id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </form>
    </div>
  );
}
