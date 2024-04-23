import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import BaseCellRenderer from 'components/core-ui-lib/Table/renderers/BaseCellRenderer';
import { useRef } from 'react';
import { components, OptionProps } from 'react-windowed-select';

interface CustomSelectCelRendererProps extends ICellRendererParams {
  options?: SelectOption[];
  eGridCell: HTMLElement;
  placeholder?: string;
  isMulti?: boolean;
  defaultValue?: string;
}

const CustomSelectCelRenderer = ({
  options = [],
  setValue,
  eGridCell,
  placeholder = '',
  defaultValue = '',
  value,
  isMulti = false,
  node,
  colDef,
  data,
  ...props
}: CustomSelectCelRendererProps) => {
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
        value={value || defaultValue}
        isMulti={isMulti}
        ref={selectRef}
        renderOption={(option) => <CustomOption option={option} />}
        {...props}
      />
    </BaseCellRenderer>
  );
};

export default CustomSelectCelRenderer;
