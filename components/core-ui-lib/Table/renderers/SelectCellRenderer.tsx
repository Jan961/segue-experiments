import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import BaseCellRenderer from 'components/core-ui-lib/Table/renderers/BaseCellRenderer';
import { useRef } from 'react';
import { components, OptionProps } from 'react-windowed-select';

interface SelectCellRendererProps extends ICellRendererParams {
  options?: SelectOption[];
  eGridCell: HTMLElement;
  placeholder?: string;
  isMulti?: boolean;
  customWidth?: string;
  isSearchable?: boolean;
}

const SelectCellRenderer = ({
  options = [],
  setValue,
  eGridCell,
  placeholder = '',
  value,
  isMulti = false,
  isSearchable = false,
  node,
  colDef,
  data,
  customWidth = 'auto',
  ...props
}: SelectCellRendererProps) => {
  const selectRef = useRef(null);

  const handleOnFocus = () => {
    selectRef.current.focus();
  };

  const handleChange = (optValue) => {
    setValue(optValue);
    node.setData({
      ...data,
      [colDef?.field]: optValue,
    });
  };

  const CustomOption = ({ option }: { option: OptionProps }) => {
    const { label, isSelected } = option;

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
        className="!shadow-none p-[2.5px]"
        placeholder={placeholder}
        value={value}
        isMulti={isMulti}
        ref={selectRef}
        customWidth={customWidth}
        isSearchable={isSearchable}
        renderOption={(option) => <CustomOption option={option} />}
        {...props}
      />
    </BaseCellRenderer>
  );
};

export default SelectCellRenderer;
