import { useRef } from 'react';
import BaseCellRenderer from 'components/core-ui-lib/Table/renderers/BaseCellRenderer';
import { TextInputProps } from 'components/core-ui-lib/TextInput/TextInput';
import TextInput from 'components/core-ui-lib/TextInput';

interface SalesValueRendererProps extends TextInputProps {
  eGridCell: HTMLElement;
  currencySymbol: string;
}

const SalesValueInputRenderer = ({ eGridCell, error, ...props }: SalesValueRendererProps) => {
  const inputRef = useRef(null);

  const handleOnFocus = () => {
    inputRef.current.select();
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      <div className="flex flex-row">
        <div className="text-primary-input-text font-bold">{props.currencySymbol}</div>
        <TextInput error={error} ref={inputRef} {...props} />
      </div>
    </BaseCellRenderer>
  );
};
export default SalesValueInputRenderer;
