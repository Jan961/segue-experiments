import { Combobox } from '@headlessui/react';
import classNames from 'classnames';
import { TypeaheadOption } from 'components/core-ui-lib/Typeahead/Typeahead';
import { useMemo } from 'react';

type TProductionOption = {
  option: TypeaheadOption;
  selectedOption: TypeaheadOption;
  handleOptionSelect: (option: TypeaheadOption) => void;
};

const ProductionOption = ({ option, selectedOption }: TProductionOption) => {
  const selected = useMemo(() => option.value === selectedOption?.value, [selectedOption, option.value]);
  const isArchived = useMemo(() => option?.IsArchived, [option]);
  return (
    <Combobox.Option
      key={option.value}
      value={option}
      className={classNames(
        {
          'bg-primary-list-row-active !text-white': selected && !isArchived,
          'text-primary-input-text': !selected,
          '!text-white bg-neutral-500': selected && isArchived,
          'bg-neutral-300 hover:bg-neutral-400 hover:!text-white': isArchived,
          'hover:bg-primary-list-row-hover hover:!text-white active:bg-primary-list-row-active active:!text-white':
            !isArchived,
        },
        `relative cursor-pointer select-none py-2 px-4`,
      )}
    >
      {({ selected }) => (
        <span
          className={classNames(`block truncate ${selected ? 'font-medium' : 'font-normal'}`, {
            'font-medium': selected,
            'font-normal': !selected,
          })}
        >
          {option.text}
        </span>
      )}
    </Combobox.Option>
  );
};

export default ProductionOption;
