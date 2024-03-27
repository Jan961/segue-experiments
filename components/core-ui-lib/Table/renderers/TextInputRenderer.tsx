import { useRef } from 'react';
import BaseCellRenderer from './BaseCellRenderer';
import { TextInputProps } from 'components/core-ui-lib/TextInput/TextInput';
import TextInput from 'components/core-ui-lib/TextInput';

interface TextInputRendererProps extends TextInputProps {
  eGridCell: HTMLElement;
}

const TextInputRenderer = ({ eGridCell, error, ...props }: TextInputRendererProps) => {
  const inputRef = useRef(null);

  const handleOnFocus = () => {
    inputRef.current.select();
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      <TextInput error={error} ref={inputRef} {...props} />
    </BaseCellRenderer>
  );
};
export default TextInputRenderer;
