import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { WithTestId } from 'types';
import Icon from '../Icon';
import Label from '../Label';

export type TypeaheadOption = { text: string; value: string };

export interface TypeaheadProps extends WithTestId {
  value?: string | number | undefined;
  onChange: (value: string | number) => void;
  options: TypeaheadOption[];
  className?: string;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  label?: string;
}

export default function Typeahead({
  value,
  onChange,
  options,
  className,
  placeholder = '',
  name = '',
  disabled = false,
  testId,
  label = '',
}: TypeaheadProps) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<TypeaheadOption>({ text: '', value: '' });

  const filteredOptions = useMemo(() => {
    return query === ''
      ? options
      : options.filter(({ text = '' }) => {
          return text.toLowerCase().includes(query.toLowerCase());
        });
  }, [query, options]);

  const onInputFocus = () => {
    inputRef.current?.select();
  };

  const handleOptionSelect = (o: TypeaheadOption) => {
    setSelectedOption(o);
    onChange(o.value);
  };

  useEffect(() => {
    setSelectedOption(value && options ? options.find((o) => value === o.value) : null);
  }, [value]);

  return (
    <div
      className={`${className} !shadow-sm-shadow border border-primary-border rounded-md flex items-center text-sm`}
      data-testid={`${testId ? `form-typeahead-${testId}` : 'form-typeahead'}`}
    >
      {label && (
        <div className="border-r border-primary-border px-3">
          <Label text={label} />
        </div>
      )}
      <Combobox name={name} value={selectedOption} onChange={handleOptionSelect} disabled={disabled}>
        <div className="w-full relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left">
            <Combobox.Button className="w-full flex items-center pr-2">
              <Combobox.Input
                data-testid={`${testId ? `form-typeahead-input-${testId}` : 'form-typeahead-input'}`}
                ref={inputRef}
                className="w-full h-[1.9375rem] border-none px-3 text-primary-input-text font-bold text-base focus:outline-none focus:ring-0"
                displayValue={(o: TypeaheadOption) => o?.text || ''}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={onInputFocus}
                placeholder={placeholder}
              />
              <Icon iconName="chevron-down" variant="xs" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 font-bold text-base shadow-lg focus:outline-none">
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2">Nothing found.</div>
              ) : (
                filteredOptions.map((o) => (
                  <Combobox.Option
                    key={o.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-primary-list-row-active text-white' : 'text-primary-input-text'
                      } hover:'bg-primary-list-row-hover hover:text-white active:'bg-primary-list-row-active active:text-white`
                    }
                    value={o}
                  >
                    {({ selected }) => (
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{o.text}</span>
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
