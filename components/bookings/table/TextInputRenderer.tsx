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

  const [placeholder, setPlaceholder] = useState<string>('Please enter Show Name');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (colDef?.field === 'Code') {
      setPlaceholder('Show Code');
    }
  }, [colDef]);

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
    setError('');
    if (e.target.value.length === 0) {
      setError('error');
    }
  };

  return (
    <div className="pl-1 pr-2 mt-1" tabIndex={1}>
      <TextInput
        error={error}
        placeHolder={placeholder}
        className="w-full"
        ref={elRef}
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default TextInputRenderer;
