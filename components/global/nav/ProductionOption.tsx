import classNames from 'classnames';
import { TypeaheadOption } from 'components/core-ui-lib/Typeahead/Typeahead';

type TProductionOption = {
  option: TypeaheadOption;
};

const ProductionOption = ({ option }: TProductionOption) => {
  const { data, isSelected, selectOption } = option;
  const isArchived = data.IsArchived;
  return (
    <div
      className={classNames(
        {
          'bg-primary-list-row-active !text-white': isSelected && !isArchived,
          'text-primary-input-text': !isSelected,
          '!text-white bg-neutral-500': isSelected && isArchived,
          'bg-neutral-300 hover:bg-neutral-400 hover:!text-white': isArchived,
          'hover:bg-primary-list-row-hover hover:!text-white active:bg-primary-list-row-active active:!text-white':
            !isArchived,
        },
        `relative cursor-pointer select-none py-2 px-4`,
      )}
      onClick={() => selectOption(data)}
    >
      <span
        className={classNames(`block truncate text-base ${isSelected ? 'font-medium' : 'font-normal'}`, {
          'font-medium': isSelected,
          'font-normal': !isSelected,
        })}
      >
        {option.label}
      </span>
    </div>
  );
};

export default ProductionOption;
