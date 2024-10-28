import { useEffect, useMemo, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import TextInputRenderer from 'components/core-ui-lib/Table/renderers/TextInputRenderer';

interface ShowsTextInputRendererProps extends ICellRendererParams {
  placeholder: string;
  disabled?: boolean;
}

const CurrencyExchangeRenderer = ({
  value,
  setValue,
  eGridCell,
  placeholder,
  node,
  colDef,
  data,
  disabled = true,
}: ShowsTextInputRendererProps) => {
  const [inputValue, setInputValue] = useState(value);
  const { toSymbol, fromCurrencyCode } = data.exchange || {};
  const currencySymbol = useMemo(() => String.fromCharCode(parseInt(toSymbol, 16)), [toSymbol]);
  useEffect(() => {
    if (value) {
      setInputValue(value + '');
    }
  }, [value]);

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (newValue === '') {
      setInputValue('');
      setValue(0);
      node.setData({ ...data, [colDef?.field]: 0 });
    } else {
      const intValue = parseFloat(newValue);
      if (!isNaN(intValue)) {
        setInputValue(newValue);
        setValue(intValue);
        node.setData({ ...data, [colDef?.field]: intValue });
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div>{currencySymbol}1:</div>
      <div className="pl-1 pr-2 mt-1" tabIndex={1}>
        <TextInputRenderer
          eGridCell={eGridCell}
          placeholder={placeholder}
          className="w-full"
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      <div>{fromCurrencyCode}</div>
    </div>
  );
};

export default CurrencyExchangeRenderer;
