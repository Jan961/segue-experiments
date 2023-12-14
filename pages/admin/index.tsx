import { PermissionGroup } from '@prisma/client';
import { getPermissionsList } from 'services/permissionService';
import { Fragment, useState } from 'react';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid';

export async function getServerSideProps() {
  const permissions = await getPermissionsList();
  console.log('Pem ', permissions);
  return { props: { permissions } };
}

interface AdminProps {
  permissions: PermissionGroup[];
}

const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: true },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Admin({ permissions = [] }: AdminProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10">
      <form className="hidden lg:block">
        {filters.map((section) => (
          <Disclosure as="div" key={section.id} className="border border-gray-200 p-6">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <span className="ml-4 font-medium text-gray-900">{section.name}</span>
                </Disclosure.Button>

                <Disclosure.Panel className="ml-3">
                  <div className="space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          defaultChecked={option.checked}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </form>
    </div>
  );
}
