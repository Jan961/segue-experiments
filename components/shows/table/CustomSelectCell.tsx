import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import BaseCellRenderer from 'components/core-ui-lib/Table/renderers/BaseCellRenderer';
import { useRef } from 'react';
import { components, OptionProps } from 'react-windowed-select';

interface CustomSelectCellProps extends ICellRendererParams {
  options?: SelectOption[];
  eGridCell: HTMLElement;
  placeholder?: string;
  isMulti?: boolean;
  defaultValue?: string;
}

const CustomSelectCell = ({
  options = [],
  setValue,
  eGridCell,
  placeholder = '',
  defaultValue = '',
  value,
  isMulti = false,
  ...props
}: CustomSelectCellProps) => {
  const selectRef = useRef(null);

  const handleOnFocus = () => {
    selectRef.current.focus();
  };

  const handleChange = (e) => {
    setValue(e);
  };

  const CustomOption = ({ option }: { option: OptionProps }) => {
    const { label, isSelected } = option;

    console.log(label, isSelected, option);

    return (
      <components.Option {...option}>
        <div>
          <span
            className={classNames(`block truncate text-base ${isSelected ? 'font-medium' : 'font-normal'}`, {
              'font-medium': isSelected,
              'font-normal': !isSelected,
            })}
          >
            {isMulti && <input checked={isSelected} type="checkbox" {...props} />} {label}
          </span>
        </div>
      </components.Option>
    );
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      <Select
        isClearable={false}
        options={options}
        onChange={handleChange}
        className="ag-custom-component-popup !z-50 rounded p-1"
        placeholder={placeholder}
        value={defaultValue || value}
        isMulti={isMulti}
        ref={selectRef}
        renderOption={(option) => <CustomOption option={option} />}
        {...props}
      />
    </BaseCellRenderer>
  );
};

export default CustomSelectCell;
