import { useEffect, useRef, useState } from 'react';
import BaseCellRenderer from './BaseCellRenderer';
import { TextInputProps } from 'components/core-ui-lib/TextInput/TextInput';
import TextInput from 'components/core-ui-lib/TextInput';

interface TextInputRendererProps extends TextInputProps {
  eGridCell: HTMLElement;
}

const TextInputRenderer = ({ eGridCell, error, onChange, value, ...props }: TextInputRendererProps) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  const handleOnFocus = () => {
    inputRef.current.select();
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      <TextInput error={error} ref={inputRef} onChange={handleChange} value={inputValue} {...props} />
    </BaseCellRenderer>
  );
};
export default TextInputRenderer;
