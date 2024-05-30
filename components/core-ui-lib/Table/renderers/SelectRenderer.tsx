import Select from 'components/core-ui-lib/Select';
import { useRef } from 'react';
import BaseCellRenderer from './BaseCellRenderer';
import { SelectProps } from 'components/core-ui-lib/Select/Select';

interface SelectRendererProps extends SelectProps {
  id?: string;
  eGridCell: HTMLElement;
}

const SelectRenderer = ({ eGridCell, ...props }: SelectRendererProps) => {
  const selectRef = useRef(null);

  const handleOnFocus = () => {
    selectRef.current.focus();
  };

  const hasSalesData: boolean = !(props['data']?.hasSalesData === false);

  return (
    <div className="pl-1 pr-2 mt-1">
      {hasSalesData ? (
        <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
          <Select ref={selectRef} {...props} />
        </BaseCellRenderer>
      ) : (
        'No Sales Data'
      )}
    </div>
  );
};
export default SelectRenderer;
