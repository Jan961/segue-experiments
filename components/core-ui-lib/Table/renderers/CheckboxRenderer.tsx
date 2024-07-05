import Checkbox from 'components/core-ui-lib/Checkbox';
import { useRef } from 'react';
import BaseCellRenderer from './BaseCellRenderer';

interface CheckboxRendererProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  eGridCell: HTMLElement;
  label?: string;
  labelBeforeCheck?: boolean;
  className?: string;
  disabled?: boolean;
}

const CheckboxRenderer = ({
  id,
  eGridCell,
  checked,
  onChange,
  name,
  labelBeforeCheck,
  label,
  className,
  disabled,
}: CheckboxRendererProps) => {
  const checkRef = useRef(null);

  const handleOnFocus = () => {
    checkRef.current.focus();
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      <div className={`flex flex-row ${className}`}>
        {labelBeforeCheck && <div className="-mt-2.5 mr-2">{label}</div>}
        <Checkbox
          ref={checkRef}
          id={id}
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-[1.1875rem] h-[1.1875rem]"
          disabled={disabled}
        />
        {!labelBeforeCheck && <div className="-mt-2.5 ml-2">{label}</div>}
      </div>
    </BaseCellRenderer>
  );
};
export default CheckboxRenderer;
