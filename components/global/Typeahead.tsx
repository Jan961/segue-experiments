import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useMemo, useRef, useState, useEffect } from 'react';

export type TypeaheadOption = { value: string | number; name: string };
export interface TypeaheadProps {
  value: string | number; name: string ;
  onChange: (value: string | number) => void;
  options: TypeaheadOption[];
  className?: string;
  placeholder?: string;
  label?: string;
  dropdownClassName?: string;
}

export default function Typeahead({ value, onChange, options, className }: TypeaheadProps) {
  const inputRef = useRef(null);
  const containerRef = useRef(null); 
  const [query, setQuery] = useState<string>('');
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const toggleOptionsVisibility = () => {
    setShowOptions(!showOptions);
  };

  const filteredOptions = useMemo(() => {
    return query === ''
      ? options
      : options.filter(({ name }) => {
        return name.toLowerCase().includes(query.toLowerCase());
      });
  }, [query, options]);

  const onInputClick = () => {
    toggleOptionsVisibility(); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleComboboxChange = (value: string | number) => {
    onChange(value);
  };

  return (
    <div ref={containerRef} className={className}>
      <Combobox value={value} onChange={handleComboboxChange}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              ref={inputRef}
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(value: TypeaheadOption) => value ? value.name : ''}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={onInputClick}
              onClick={onInputClick}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2"> {/* Toggle visibility on button click */}
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            show={showOptions} // Controlled by state
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">Nothing found.</div>
              ) : (
                filteredOptions.map((o) => (
                  <Combobox.Option
                    key={o.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={o}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{o.name}</span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                              }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
