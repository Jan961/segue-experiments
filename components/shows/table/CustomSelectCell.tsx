import { ICellRendererParams } from 'ag-grid-community';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import BaseCellRenderer from 'components/core-ui-lib/Table/renderers/BaseCellRenderer';
import { useRef } from 'react';

interface CustomSelectCellProps extends ICellRendererParams {
  options?: SelectOption[];
  eGridCell: HTMLElement;
  placeholder?: string;
}

const CustomSelectCell = ({ options = [], eGridCell, placeholder = '', ...props }: CustomSelectCellProps) => {
  const selectRef = useRef(null);

  const handleOnFocus = () => {
    selectRef.current.focus();
  };

  const handleChange = (e) => {
    console.log(e);
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      <Select
        isClearable={false}
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
        ref={selectRef}
        {...props}
      />
    </BaseCellRenderer>
  );
};

export default CustomSelectCell;
