import Typeahead from 'components/core-ui-lib/Typeahead';
import { useRef } from 'react';
import BaseCellRenderer from './BaseCellRenderer';
import { TypeaheadProps } from 'components/core-ui-lib/Typeahead/Typeahead';

interface SelectRendererProps extends TypeaheadProps {
  id?: string;
  eGridCell: HTMLElement;
}

const SelectRenderer = ({ eGridCell, ...props }: SelectRendererProps) => {
  const selectRef = useRef(null);

  const handleOnFocus = () => {
    selectRef.current.focus();
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      <Typeahead ref={selectRef} {...props} />
    </BaseCellRenderer>
  );
};
export default SelectRenderer;
