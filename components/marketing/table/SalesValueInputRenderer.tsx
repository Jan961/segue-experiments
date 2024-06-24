import { useRef, useState } from 'react';
import BaseCellRenderer from 'components/core-ui-lib/Table/renderers/BaseCellRenderer';
import { TextInputProps } from 'components/core-ui-lib/TextInput/TextInput';
import TextInput from 'components/core-ui-lib/TextInput';

interface SalesValueRendererProps extends TextInputProps {
  eGridCell: HTMLElement;
  currency: string;
  onUpdate: (value: string) => void;
}

const SalesValueInputRenderer = ({
  eGridCell,
  error,
  onUpdate,
  value,
  currency,
  className,
}: SalesValueRendererProps) => {
  const [fieldValue, setFieldValue] = useState(value);

  const inputRef = useRef(null);

  const handleOnFocus = () => {
    inputRef.current.select();
  };

  const handleBlur = () => {
    if (onUpdate) {
      onUpdate(fieldValue.toString());
    }
  };

  const changeValueState = (value) => {
    const regexPattern = /^-?\d*(\.\d*)?$/;
    // validate value with regex
    if (regexPattern.test(value)) {
      let newValue = value;

      // Remove leading zeros
      if (newValue.startsWith('0') && newValue.length > 1 && newValue[1] !== '.') {
        newValue = newValue.replace(/^0+/, '');
      }

      // Set to 0 if blank
      if (newValue === '') {
        newValue = '0';
      }

      setFieldValue(newValue);
    }
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      <div className="flex flex-row">
        <div className="text-primary-input-text font-bold">{currency}</div>
        <TextInput
          className={className}
          error={error}
          ref={inputRef}
          value={fieldValue}
          onChange={(e) => changeValueState(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
    </BaseCellRenderer>
  );
};

export default SalesValueInputRenderer;
