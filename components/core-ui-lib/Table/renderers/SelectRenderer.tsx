import Select from 'components/core-ui-lib/Select';
import { useRef } from 'react';
import BaseCellRenderer from './BaseCellRenderer';
import { SelectProps } from 'components/core-ui-lib/Select/Select';

interface SelectRendererProps extends SelectProps {
  id?: string;
  eGridCell: HTMLElement;
  hidden?: boolean;
}

const SelectRenderer = ({ eGridCell, hidden = false, ...props }: SelectRendererProps) => {
  const selectRef = useRef(null);

  const handleOnFocus = () => {
    selectRef.current?.focus?.();
  };

  return (
    <div className="pl-1 pr-2 mt-1">
      <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
        {!hidden && <Select ref={selectRef} {...props} />}
      </BaseCellRenderer>
    </div>
  );
};
export default SelectRenderer;
