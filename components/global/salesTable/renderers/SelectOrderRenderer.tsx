import Select from 'components/core-ui-lib/Select';
import { useRef } from 'react';
import BaseCellRenderer from 'components/core-ui-lib/Table/renderers/BaseCellRenderer';
import { SelectProps } from 'components/core-ui-lib/Select/Select';

interface SelectRendererProps extends SelectProps {
  id?: string;
  eGridCell: HTMLElement;
  hasSalesData: boolean;
}

const SelectOrderRenderer = ({ eGridCell, ...props }: SelectRendererProps) => {
  const selectRef = useRef(null);

  const handleOnFocus = () => {
    selectRef.current.focus();
  };

  const hasSalesData = !(props?.hasSalesData === false);

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

export default SelectOrderRenderer;
