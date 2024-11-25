import { useEffect, useRef, useState } from 'react';
import BaseCellRenderer from './BaseCellRenderer';
import { TextInputProps } from 'components/core-ui-lib/TextInput/TextInput';
import TextInput from 'components/core-ui-lib/TextInput';
import { formatDecimalOnBlur } from 'utils';

interface TextInputRendererProps extends TextInputProps {
  eGridCell: HTMLElement;
  currency: string;
}

const CurrencyInputRenderer = ({ eGridCell, error, value, onChange, currency, ...props }: TextInputRendererProps) => {
  const [inputValue, setInputValue] = useState(value);

  const inputRef = useRef(null);

  const handleOnFocus = () => {
    inputRef.current.select();
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  const handleBlur = (event) => {
    const formattedValue = formatDecimalOnBlur(event);
    setInputValue(formattedValue);
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      <div className="pl-1 pr-2 flex">
        <div className="text-primary-input-text mr-2">{currency || ''}</div>
        <TextInput
          type="text"
          error={error}
          ref={inputRef}
          onChange={handleChange}
          onBlur={handleBlur}
          value={inputValue}
          {...props}
        />
      </div>
    </BaseCellRenderer>
  );
};
export default CurrencyInputRenderer;
