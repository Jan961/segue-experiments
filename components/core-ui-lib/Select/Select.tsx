import { Fragment, LegacyRef, forwardRef, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import Icon from '../Icon';
import classNames from 'classnames';
import Label from '../Label';

export type SelectOption = { text: string; value: string | number };

export interface SelectProps {
  value?: string | number;
  disabled?: boolean;
  className?: string;
  buttonClass?: string;
  onChange?: (value: string) => void;
  placeHolder?: string;
  options?: SelectOption[];
  testId?: string;
  label?: string;
  inline?: boolean;
}

const Select = forwardRef((props: SelectProps, ref: LegacyRef<HTMLDivElement>) => {
  const {
    value = '',
    options = [],
    className = '',
    buttonClass = '',
    disabled = false,
    onChange,
    placeHolder = 'Please select a value',
    testId = '',
    label = '',
    inline = false,
  } = props;

  const [selectedOption, setSelectedOption] = useState<SelectOption>({ text: '', value: '' });

  const handleOptionSelect = (v: string) => {
    const selected = options.find(({ value }) => value === v);
    setSelectedOption(selected);
    onChange(v);
  };

  useEffect(() => {
    setSelectedOption(value && options ? options.find((o) => value === o.value) : null);
  }, [value, options]);

  const disabledClass = disabled ? `!bg-disabled !cursor-not-allowed !pointer-events-none` : '';

  return (
    <div
      ref={ref}
      className={classNames(`${className}  flex items-center ${disabledClass}`, {
        '!shadow-sm-shadow border border-primary-border rounded-md': !inline,
      })}
      data-testid={`${testId ? `form-typeahead-${testId}` : 'form-typeahead'}`}
    >
      {label && (
        <div className="flex items-center min-w-fit h-[1.9375rem] border-r border-primary-border px-3">
          <Label text={label} />
        </div>
      )}
      <Listbox value={value} onChange={handleOptionSelect} disabled={disabled}>
        {({ open }) => (
          <>
            <div className="relative w-full">
              <Listbox.Button
                className={classNames(
                  `${buttonClass} relative w-full h-[1.9375rem] cursor-default rounded-md bg-white pl-3 pr-10 text-left focus:outline-none focus:ring-0`,
                  {
                    'border border-primary-border': inline,
                  },
                )}
              >
                <span className="block truncate text-primary-input-text text-base">
                  {selectedOption?.text || placeHolder}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <Icon iconName="chevron-down" variant="xs" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {options.map((o) => (
                    <Listbox.Option
                      key={o.value}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-primary-list-row-active text-white' : 'text-primary-input-text',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value={o.value}
                    >
                      {({ selected }) => (
                        <span className={classNames(selected ? 'font-medium' : 'font-normal', 'block truncate')}>
                          {o.text}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
});
Select.displayName = 'Select';
export default Select;
