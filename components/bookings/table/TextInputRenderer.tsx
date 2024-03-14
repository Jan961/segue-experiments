import { useEffect, useRef, useState } from 'react';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import TextInput from 'components/core-ui-lib/TextInput';

interface SelectDayTypeRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const TextInputRenderer = (props: SelectDayTypeRendererProps) => {
  const { data, value, setValue, node, eGridCell, colDef } = props;
  const [inputValue, setInputValue] = useState(value || '');
  const elRef = useRef(null);

  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (eGridCell) {
      const setFocus = () => {
        elRef?.current?.focus();
      };
      eGridCell.addEventListener('focusin', setFocus);

      return () => {
        eGridCell.removeEventListener('focusin', setFocus);
      };
    }
  }, [eGridCell]);

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
    setValue(e.target.value);
    node.setData({ ...data, [colDef?.field]: e.target.value });
  };

  return (
    <div className="pl-1 pr-2 mt-1" tabIndex={1}>
      <TextInput className="w-full" ref={elRef} value={inputValue} onChange={handleChange} />
    </div>
  );
};

export default TextInputRenderer;
