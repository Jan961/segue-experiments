import classNames from 'classnames';
import { components, OptionProps } from 'react-windowed-select';

interface ProductionOptionProps extends OptionProps {
  data: { IsArchived?: boolean };
}

const ProductionOption = ({ option }: { option: ProductionOptionProps }) => {
  const { label, isSelected } = option;

  return (
    <components.Option {...option}>
      <div data-testid="prod-option">
        <span
          className={classNames(`block truncate text-base ${isSelected ? 'font-medium' : 'font-normal'}`, {
            'font-medium': isSelected,
            'font-normal': !isSelected,
          })}
        >
          {label}
        </span>
      </div>
    </components.Option>
  );
};

export default ProductionOption;
