import Checkbox from 'components/core-ui-lib/Checkbox';
import { useRef } from 'react';
import BaseCellRenderer from './BaseCellRenderer';

interface CheckboxRendererProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  eGridCell: HTMLElement;
}

const CheckboxRenderer = ({ id, eGridCell, checked, onChange, name }: CheckboxRendererProps) => {
  const checkRef = useRef(null);

  const handleOnFocus = () => {
    checkRef.current.focus();
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      <Checkbox
        ref={checkRef}
        id={id}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-[1.1875rem] h-[1.1875rem]"
      />
    </BaseCellRenderer>
  );
};
export default CheckboxRenderer;
