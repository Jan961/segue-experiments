import { useEffect, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import TextInputRenderer from 'components/core-ui-lib/Table/renderers/TextInputRenderer';

const ShowsTextInputRenderer = (props: ICellRendererParams) => {
  const { value, setValue, eGridCell, colDef } = props;
  const [inputValue, setInputValue] = useState(value || '');

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

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
    setValue(e.target.value);
    setError('');
    if (e.target.value.length === 0) {
      setError('error');
    }
  };

  return (
    <div className="pl-1 pr-2 mt-1" tabIndex={1}>
      <TextInputRenderer
        eGridCell={eGridCell}
        placeholder={placeholder}
        className="w-full"
        value={inputValue}
        error={error}
        onChange={handleChange}
      />
    </div>
  );
};

export default ShowsTextInputRenderer;
