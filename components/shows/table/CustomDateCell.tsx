import { ICellRendererParams } from 'ag-grid-community';
import DateInput from 'components/core-ui-lib/DateInput';
import { useEffect, useRef, useState } from 'react';

interface CustomDateCellProps extends ICellRendererParams {
  internalField?: string;
  fieldIndex?: number;
}

const CustomDateCell = ({ data, colDef: { field }, internalField, fieldIndex }: CustomDateCellProps) => {
  const [value, setValue] = useState(null);
  const fromInputRef = useRef(null);

  useEffect(() => {
    if (internalField && fieldIndex) {
      if (data[field] && data[field].length > 0 && data[field][fieldIndex]) {
        setValue(data[field][fieldIndex][internalField]);
      }
    }
  }, []);

  const handleDateFromChange = (dateVal) => {
    console.log(dateVal);
  };

  return (
    <div className="ag-input-wrapper w-full h-full pr-[2px] rounded">
      <DateInput
        ref={fromInputRef}
        popperClassName="ag-custom-component-popup !z-50 rounded"
        inputClass={`!shadow-none !border-primary-white`}
        value={value}
        onChange={handleDateFromChange}
        minDate={new Date()}
      />
    </div>
  );
};

export default CustomDateCell;
