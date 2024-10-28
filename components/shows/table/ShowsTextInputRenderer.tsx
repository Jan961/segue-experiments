import { useEffect, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import TextInputRenderer from 'components/core-ui-lib/Table/renderers/TextInputRenderer';

interface ShowsTextInputRendererProps extends ICellRendererParams {
  placeholder: string;
  disabled?: boolean;
}

const ShowsTextInputRenderer = ({ value, setValue, eGridCell, placeholder, disabled }: ShowsTextInputRendererProps) => {
  const [inputValue, setInputValue] = useState(value || '');

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (value: any) => {
    setInputValue(value);
    setValue(value);
    setError('');
    if (value.length === 0) {
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
        disabled={disabled}
      />
    </div>
  );
};

export default ShowsTextInputRenderer;
